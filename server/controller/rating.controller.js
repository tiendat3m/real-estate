const asyncHandler = require('express-async-handler')
const db = require('../models')

// GET /rating/post/:idPost
const getByPost = asyncHandler(async (req, res) => {
    const { idPost } = req.params
    const ratings = await db.Rating.findAll({
        where: { idPost },
        include: [{ association: 'user', attributes: ['id', 'fullname', 'avatar'] }],
        order: [['createdAt', 'DESC']],
    })
    return res.json({ success: true, data: ratings })
})

// POST /rating  { idPost, star, content }
const upsert = asyncHandler(async (req, res) => {
    const { idPost, star, content } = req.body
    if (!idPost || !star) {
        res.status(400)
        throw new Error('Thiếu idPost hoặc star')
    }
    const starNum = Math.max(1, Math.min(5, Number(star)))
    const [rating, created] = await db.Rating.findOrCreate({
        where: { idPost, idUser: req.user.id },
        defaults: { star: starNum, content: content || '' },
    })
    if (!created) {
        await rating.update({ star: starNum, content: content || rating.content })
    }
    // tính lại avgScore của post
    const all = await db.Rating.findAll({ where: { idPost }, attributes: ['star'] })
    const avg = all.length ? all.reduce((s, r) => s + r.star, 0) / all.length : 0
    await db.Post.update({ avgScore: Math.round(avg * 10) / 10 }, { where: { id: idPost } })
    return res.json({ success: true, data: rating })
})

// DELETE /rating/:id
const remove = asyncHandler(async (req, res) => {
    const { id } = req.params
    const rating = await db.Rating.findByPk(id)
    if (!rating) {
        res.status(404)
        throw new Error('Không tìm thấy đánh giá')
    }
    if (rating.idUser !== req.user.id && req.user.role !== 'admin') {
        res.status(403)
        throw new Error('Không có quyền xoá đánh giá')
    }
    await rating.destroy()
    return res.json({ success: true })
})

module.exports = { getByPost, upsert, remove }