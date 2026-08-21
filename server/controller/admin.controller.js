const asyncHandler = require('express-async-handler')
const { Op } = require('sequelize')
const db = require('../models')
const { parseImages } = require('./post.controller')

const postInclude = [{ association: 'user', attributes: ['id', 'fullname', 'email', 'phone', 'verifiedAgent'] }]

const stats = asyncHandler(async (req, res) => {
    const users = await db.User.count()
    const posts = await db.Post.count()
    const wishlists = await db.Wishlist.count()
    const leads = await db.Lead.count()
    const reports = await db.Report.count({ where: { status: 'pending' } })

    const byStatus = {}
    for (const s of ['Còn trống', 'Đang đàm phán', 'Đã bàn giao']) byStatus[s] = await db.Post.count({ where: { status: s } })
    const byApproval = {}
    for (const s of ['pending', 'approved', 'rejected']) byApproval[s] = await db.Post.count({ where: { approvalStatus: s } })
    const byAvailability = {}
    for (const s of ['available', 'negotiating', 'handed_over', 'hidden']) byAvailability[s] = await db.Post.count({ where: { availabilityStatus: s } })

    return res.json({ success: true, data: { users, posts, wishlists, leads, reports, byStatus, byApproval, byAvailability } })
})

const listPosts = asyncHandler(async (req, res) => {
    const { status, approvalStatus, availabilityStatus, q } = req.query
    const where = {}
    if (status) where.status = status
    if (approvalStatus) where.approvalStatus = approvalStatus
    if (availabilityStatus) where.availabilityStatus = availabilityStatus
    if (q) where[Op.or] = [{ title: { [Op.iLike]: `%${q}%` } }, { address: { [Op.iLike]: `%${q}%` } }]
    const posts = await db.Post.findAll({
        where,
        include: postInclude,
        order: [['createdAt', 'DESC']],
    })
    return res.json({ success: true, data: posts.map(parseImages) })
})

const updatePostStatus = asyncHandler(async (req, res) => {
    const post = await db.Post.findByPk(req.params.id)
    if (!post) {
        res.status(404)
        throw new Error('Không tìm thấy tin đăng')
    }
    const payload = {}
    const allowed = ['status', 'availabilityStatus', 'approvalStatus', 'rejectReason', 'verified', 'isFeatured', 'isBoosted', 'featuredUntil', 'boostedUntil']
    allowed.forEach((key) => {
        if (req.body[key] !== undefined) payload[key] = req.body[key]
    })
    if (payload.approvalStatus === 'approved') payload.rejectReason = null
    await post.update(payload)
    return res.json({ success: true, data: parseImages(post) })
})

const deletePost = asyncHandler(async (req, res) => {
    const post = await db.Post.findByPk(req.params.id)
    if (!post) {
        res.status(404)
        throw new Error('Không tìm thấy tin đăng')
    }
    await post.destroy()
    return res.json({ success: true })
})

const listUsers = asyncHandler(async (req, res) => {
    const users = await db.User.findAll({
        attributes: { exclude: ['password', 'resetPwdToken', 'resetPwdExpiry'] },
        order: [['createdAt', 'DESC']],
    })
    return res.json({ success: true, data: users })
})

const setUserRole = asyncHandler(async (req, res) => {
    const user = await db.User.findByPk(req.params.id)
    if (!user) {
        res.status(404)
        throw new Error('Không tìm thấy user')
    }
    const payload = {}
    if (req.body.role !== undefined) {
        if (!['user', 'admin'].includes(req.body.role)) {
            res.status(400)
            throw new Error('Role không hợp lệ')
        }
        payload.role = req.body.role
    }
    if (req.body.userStatus !== undefined) payload.userStatus = req.body.userStatus
    if (req.body.verifiedAgent !== undefined) payload.verifiedAgent = req.body.verifiedAgent
    if (req.body.companyName !== undefined) payload.companyName = req.body.companyName
    await user.update(payload)
    return res.json({ success: true, data: user })
})

const listLeads = asyncHandler(async (req, res) => {
    const { status, q } = req.query
    const where = {}
    if (status) where.status = status
    if (q) {
        where[Op.or] = [
            { fullname: { [Op.iLike]: `%${q}%` } },
            { phone: { [Op.iLike]: `%${q}%` } },
            { email: { [Op.iLike]: `%${q}%` } },
        ]
    }
    const leads = await db.Lead.findAll({
        where,
        include: [
            { association: 'post', include: postInclude },
            { association: 'user', attributes: ['id', 'fullname', 'email', 'phone', 'avatar'] },
        ],
        order: [['createdAt', 'DESC']],
    })
    return res.json({ success: true, data: leads.map((lead) => ({ ...lead.get({ plain: true }), post: parseImages(lead.post) })) })
})

const updateLead = asyncHandler(async (req, res) => {
    const lead = await db.Lead.findByPk(req.params.id)
    if (!lead) {
        res.status(404)
        throw new Error('Không tìm thấy lead')
    }
    const payload = {}
    if (req.body.status) payload.status = req.body.status
    if (req.body.note !== undefined) payload.note = req.body.note
    await lead.update(payload)
    return res.json({ success: true, data: lead })
})

const listReports = asyncHandler(async (req, res) => {
    const { status } = req.query
    const where = {}
    if (status) where.status = status
    const reports = await db.Report.findAll({
        where,
        include: [
            { association: 'post', include: postInclude },
            { association: 'user', attributes: ['id', 'fullname', 'email', 'phone', 'avatar'] },
        ],
        order: [['createdAt', 'DESC']],
    })
    return res.json({ success: true, data: reports.map((report) => ({ ...report.get({ plain: true }), post: parseImages(report.post) })) })
})

const updateReport = asyncHandler(async (req, res) => {
    const report = await db.Report.findByPk(req.params.id)
    if (!report) {
        res.status(404)
        throw new Error('Không tìm thấy report')
    }
    await report.update({ status: req.body.status || report.status })
    return res.json({ success: true, data: report })
})

module.exports = {
    stats,
    listPosts,
    updatePostStatus,
    deletePost,
    listUsers,
    setUserRole,
    listLeads,
    updateLead,
    listReports,
    updateReport,
}
