const asyncHandler = require('express-async-handler')
const db = require('../models')

// GET /wishlist  (của tôi, kèm post)
const getMine = asyncHandler(async (req, res) => {
    const items = await db.Wishlist.findAll({
        where: { idUser: req.user.id },
        include: [{ association: 'post', include: [{ association: 'user', attributes: ['id', 'fullname', 'avatar'] }] }],
        order: [['createdAt', 'DESC']],
    })
    return res.json({ success: true, data: items })
})

// POST /wishlist/toggle  { idPost }
const toggle = asyncHandler(async (req, res) => {
    const { idPost } = req.body
    if (!idPost) {
        res.status(400)
        throw new Error('Thiếu idPost')
    }
    const existing = await db.Wishlist.findOne({ where: { idPost, idUser: req.user.id } })
    if (existing) {
        await existing.destroy()
        return res.json({ success: true, wished: false })
    }
    await db.Wishlist.create({ idPost, idUser: req.user.id })
    return res.json({ success: true, wished: true })
})

// GET /wishlist/check/:idPost
const check = asyncHandler(async (req, res) => {
    const { idPost } = req.params
    const existing = await db.Wishlist.findOne({ where: { idPost, idUser: req.user.id } })
    return res.json({ success: true, wished: !!existing })
})

module.exports = { getMine, toggle, check }