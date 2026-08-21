const asyncHandler = require('express-async-handler')
const db = require('../models')
const { parseImages } = require('./post.controller')

const createLead = asyncHandler(async (req, res) => {
    const { idPost, fullname, phone, email, message } = req.body
    if (!idPost || !fullname || !phone) {
        res.status(400)
        throw new Error('Vui lòng nhập họ tên và số điện thoại')
    }
    const post = await db.Post.findByPk(idPost)
    if (!post || post.approvalStatus !== 'approved') {
        res.status(404)
        throw new Error('Không tìm thấy tin đăng')
    }
    if (req.user?.id === post.idUser) {
        res.status(400)
        throw new Error('Bạn không thể gửi liên hệ cho tin của chính mình')
    }
    const lead = await db.Lead.create({
        idPost,
        idUser: req.user?.id || null,
        fullname,
        phone,
        email,
        message,
        source: req.body.source || 'post_detail',
    })
    return res.json({ success: true, data: lead })
})

const getMine = asyncHandler(async (req, res) => {
    const leads = await db.Lead.findAll({
        include: [
            {
                association: 'post',
                where: req.user.role === 'admin' ? undefined : { idUser: req.user.id },
                include: [{ association: 'tags', attributes: ['id', 'tag'], through: { attributes: [] } }],
            },
            { association: 'user', attributes: ['id', 'fullname', 'email', 'phone', 'avatar'] },
        ],
        order: [['createdAt', 'DESC']],
    })
    return res.json({ success: true, data: leads.map((lead) => ({ ...lead.get({ plain: true }), post: parseImages(lead.post) })) })
})

const updateLead = asyncHandler(async (req, res) => {
    const lead = await db.Lead.findByPk(req.params.id, { include: [{ association: 'post' }] })
    if (!lead) {
        res.status(404)
        throw new Error('Không tìm thấy lead')
    }
    if (req.user.role !== 'admin' && lead.post.idUser !== req.user.id) {
        res.status(403)
        throw new Error('Bạn không có quyền cập nhật lead này')
    }
    const payload = {}
    if (req.body.status) payload.status = req.body.status
    if (req.body.note !== undefined) payload.note = req.body.note
    await lead.update(payload)
    return res.json({ success: true, data: lead })
})

module.exports = { createLead, getMine, updateLead }
