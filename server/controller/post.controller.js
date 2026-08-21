const asyncHandler = require('express-async-handler')
const { Op } = require('sequelize')
const db = require('../models')

const userInclude = {
    association: 'user',
    attributes: ['id', 'fullname', 'phone', 'avatar', 'email', 'verifiedAgent', 'companyName'],
}

const tagInclude = { association: 'tags', attributes: ['id', 'tag'], through: { attributes: [] } }

const slugify = (value = '') => String(value)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '')
    .slice(0, 90) || 'tin-dang'

const parseImages = (post) => {
    if (!post) return post
    const p = post.get ? post.get({ plain: true }) : post
    if (p.images) {
        try { p.images = JSON.parse(p.images) } catch { p.images = String(p.images).split(',').map((s) => s.trim()).filter(Boolean) }
    } else {
        p.images = []
    }
    if (!p.coverImage && p.images.length) p.coverImage = p.images[0]
    return p
}

const cleanPayload = (body) => {
    const payload = { ...body }
    if (Array.isArray(payload.images)) payload.images = JSON.stringify(payload.images)
    if (Array.isArray(body.images) && !payload.coverImage) payload.coverImage = body.images[0] || null
    delete payload.tags
    delete payload.idUser
    delete payload.id
    delete payload.avgScore
    delete payload.views
    delete payload.approvalStatus
    delete payload.rejectReason
    delete payload.isFeatured
    delete payload.isBoosted
    delete payload.featuredUntil
    delete payload.boostedUntil
    return payload
}

const isOwnerOrAdmin = (post, user) => user && (user.role === 'admin' || post.idUser === user.id)
const publicWhere = () => ({ approvalStatus: 'approved', availabilityStatus: { [Op.ne]: 'hidden' } })

const syncTags = async (post, tagNames) => {
    if (!Array.isArray(tagNames)) return
    const tags = []
    for (const name of tagNames) {
        const value = String(name).trim()
        if (!value) continue
        const [tag] = await db.Tag.findOrCreate({ where: { tag: value } })
        tags.push(tag)
    }
    await post.setTags(tags)
}

const getPosts = asyncHandler(async (req, res) => {
    let {
        listingType, propertyType, province, district, ward, direction, balonDirection,
        minPrice, maxPrice, minSize, maxSize, q, status, availabilityStatus,
        minBedroom, legalStatus, verified, hasImages, order = 'newest', page = 1, limit = 12,
    } = req.query

    page = Math.max(1, parseInt(page) || 1)
    limit = Math.max(1, Math.min(60, parseInt(limit) || 12))
    const offset = (page - 1) * limit

    const where = { ...publicWhere() }
    if (listingType) where.listingType = listingType
    if (propertyType) where.propertyType = propertyType
    if (province) where.province = province
    if (district) where.district = district
    if (ward) where.ward = ward
    if (direction) where.direction = direction
    if (balonDirection) where.balonDirection = balonDirection
    if (status) where.status = status
    if (availabilityStatus) where.availabilityStatus = availabilityStatus
    if (legalStatus) where.legalStatus = legalStatus
    if (verified === 'true') where.verified = true
    if (hasImages === 'true') where.images = { [Op.ne]: null }
    if (minBedroom) where.bedroom = { [Op.gte]: Number(minBedroom) }
    if (minPrice || maxPrice) {
        where.price = {}
        if (minPrice) where.price[Op.gte] = Number(minPrice)
        if (maxPrice) where.price[Op.lte] = Number(maxPrice)
    }
    if (minSize || maxSize) {
        where.size = {}
        if (minSize) where.size[Op.gte] = Number(minSize)
        if (maxSize) where.size[Op.lte] = Number(maxSize)
    }
    if (q) {
        where[Op.or] = [
            { title: { [Op.iLike]: `%${q}%` } },
            { description: { [Op.iLike]: `%${q}%` } },
            { address: { [Op.iLike]: `%${q}%` } },
        ]
    }

    const orderMap = {
        newest: [['createdAt', 'DESC']],
        'price-asc': [['price', 'ASC']],
        'price-desc': [['price', 'DESC']],
        'size-desc': [['size', 'DESC']],
        views: [['views', 'DESC']],
        featured: [['isFeatured', 'DESC'], ['isBoosted', 'DESC'], ['createdAt', 'DESC']],
    }

    const { rows, count } = await db.Post.findAndCountAll({
        where,
        include: [userInclude, tagInclude],
        order: orderMap[order] || orderMap.newest,
        limit,
        offset,
        distinct: true,
    })

    return res.json({
        success: true,
        data: rows.map(parseImages),
        pagination: { page, limit, total: count, totalPages: Math.ceil(count / limit) },
    })
})

const getPostById = asyncHandler(async (req, res) => {
    const { id } = req.params
    const where = /^\d+$/.test(id) ? { id: Number(id) } : { slug: id }
    const post = await db.Post.findOne({
        where,
        include: [
            userInclude,
            tagInclude,
            {
                association: 'comments',
                include: [
                    { association: 'user', attributes: ['id', 'fullname', 'avatar'] },
                    { association: 'replies', include: [{ association: 'user', attributes: ['id', 'fullname', 'avatar'] }] },
                ],
            },
            { association: 'ratings', include: [{ association: 'user', attributes: ['id', 'fullname', 'avatar'] }] },
        ],
    })
    if (!post || (post.approvalStatus !== 'approved' && !isOwnerOrAdmin(post, req.user))) {
        res.status(404)
        throw new Error('Không tìm thấy tin đăng')
    }

    db.Post.increment('views', { by: 1, where: { id: post.id } }).catch(() => {})

    const ratings = post.ratings || []
    const avgScore = ratings.length ? ratings.reduce((s, r) => s + (r.star || 0), 0) / ratings.length : 0
    const p = parseImages(post)
    p.avgScore = Math.round(avgScore * 10) / 10
    p.ratingCount = ratings.length
    p.comments = (p.comments || []).filter((c) => !c.idParent)

    return res.json({ success: true, data: p })
})

const getRelated = asyncHandler(async (req, res) => {
    const post = await db.Post.findByPk(req.params.id)
    if (!post) {
        res.status(404)
        throw new Error('Không tìm thấy tin đăng')
    }
    const posts = await db.Post.findAll({
        where: {
            ...publicWhere(),
            id: { [Op.ne]: post.id },
            [Op.or]: [
                { province: post.province },
                { propertyType: post.propertyType },
                { listingType: post.listingType },
            ],
        },
        include: [userInclude, tagInclude],
        order: [['isFeatured', 'DESC'], ['createdAt', 'DESC']],
        limit: Math.min(Number(req.query.limit) || 4, 12),
    })
    return res.json({ success: true, data: posts.map(parseImages) })
})

const getMyPosts = asyncHandler(async (req, res) => {
    const posts = await db.Post.findAll({
        where: { idUser: req.user.id },
        include: [tagInclude],
        order: [['createdAt', 'DESC']],
    })
    return res.json({ success: true, data: posts.map(parseImages) })
})

const createPost = asyncHandler(async (req, res) => {
    const payload = cleanPayload(req.body)
    payload.idUser = req.user.id
    payload.approvalStatus = req.user.role === 'admin' ? 'approved' : 'pending'
    payload.availabilityStatus = payload.availabilityStatus || 'available'
    payload.slug = null

    const post = await db.Post.create(payload)
    await post.update({ slug: `${slugify(post.title)}-${post.id}` })
    await syncTags(post, req.body.tags)
    const full = await db.Post.findByPk(post.id, { include: [tagInclude] })
    return res.json({ success: true, data: parseImages(full) })
})

const updatePost = asyncHandler(async (req, res) => {
    const post = await db.Post.findByPk(req.params.id)
    if (!post) {
        res.status(404)
        throw new Error('Không tìm thấy tin đăng')
    }
    if (!isOwnerOrAdmin(post, req.user)) {
        res.status(403)
        throw new Error('Bạn không có quyền sửa tin này')
    }

    const payload = cleanPayload(req.body)
    if (req.body.availabilityStatus) payload.availabilityStatus = req.body.availabilityStatus
    if (req.user.role !== 'admin') {
        payload.approvalStatus = 'pending'
        payload.rejectReason = null
    }
    if (payload.title && payload.title !== post.title) payload.slug = `${slugify(payload.title)}-${post.id}`

    await post.update(payload)
    if (req.body.tags !== undefined) await syncTags(post, req.body.tags)
    const full = await db.Post.findByPk(post.id, { include: [tagInclude] })
    return res.json({ success: true, data: parseImages(full) })
})

const deletePost = asyncHandler(async (req, res) => {
    const post = await db.Post.findByPk(req.params.id)
    if (!post) {
        res.status(404)
        throw new Error('Không tìm thấy tin đăng')
    }
    if (!isOwnerOrAdmin(post, req.user)) {
        res.status(403)
        throw new Error('Bạn không có quyền xoá tin này')
    }
    await post.destroy()
    return res.json({ success: true })
})

const getFeatured = asyncHandler(async (req, res) => {
    const { listingType, limit = 8 } = req.query
    const where = { ...publicWhere() }
    if (listingType) where.listingType = listingType
    const posts = await db.Post.findAll({
        where,
        include: [userInclude, tagInclude],
        order: [['isFeatured', 'DESC'], ['isBoosted', 'DESC'], ['views', 'DESC'], ['createdAt', 'DESC']],
        limit: Math.min(20, parseInt(limit) || 8),
    })
    return res.json({ success: true, data: posts.map(parseImages) })
})

module.exports = {
    getPosts,
    getPostById,
    getRelated,
    getMyPosts,
    createPost,
    updatePost,
    deletePost,
    getFeatured,
    parseImages,
    slugify,
}
