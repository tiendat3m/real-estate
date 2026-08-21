const asyncHandler = require('express-async-handler')
const db = require('../models')

// GET /comment/post/:idPost  (chỉ lấy comment gốc, replies lồng sẵn)
const getByPost = asyncHandler(async (req, res) => {
    const { idPost } = req.params
    const comments = await db.Comment.findAll({
        where: { idPost, idParent: null },
        include: [
            { association: 'user', attributes: ['id', 'fullname', 'avatar'] },
            { association: 'replies', include: [{ association: 'user', attributes: ['id', 'fullname', 'avatar'] }] },
        ],
        order: [['createdAt', 'DESC']],
    })
    return res.json({ success: true, data: comments })
})

// POST /comment  { idPost, content, idParent? }
const create = asyncHandler(async (req, res) => {
    const { idPost, content, idParent } = req.body
    if (!idPost || !content) {
        res.status(400)
        throw new Error('Thiếu idPost hoặc nội dung')
    }
    const comment = await db.Comment.create({
        idPost,
        idUser: req.user.id,
        content,
        idParent: idParent || null,
    })
    const full = await db.Comment.findByPk(comment.id, {
        include: [{ association: 'user', attributes: ['id', 'fullname', 'avatar'] }],
    })
    return res.json({ success: true, data: full })
})

// DELETE /comment/:id
const remove = asyncHandler(async (req, res) => {
    const { id } = req.params
    const comment = await db.Comment.findByPk(id)
    if (!comment) {
        res.status(404)
        throw new Error('Không tìm thấy bình luận')
    }
    if (comment.idUser !== req.user.id && req.user.role !== 'admin') {
        res.status(403)
        throw new Error('Không có quyền xoá bình luận')
    }
    await db.Comment.destroy({ where: { idParent: id } })
    await comment.destroy()
    return res.json({ success: true })
})

module.exports = { getByPost, create, remove }