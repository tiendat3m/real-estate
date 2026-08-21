const asyncHandler = require('express-async-handler')
const bcrypt = require('bcryptjs')
const db = require('../models')
const hashPassword = (password) => bcrypt.hashSync(password, bcrypt.genSaltSync(10))

// GET /me
const getMe = asyncHandler(async (req, res) => {
    return res.json({ success: true, data: req.user })
})

// PUT /me  { fullname, phone, avatar }
const updateProfile = asyncHandler(async (req, res) => {
    const { fullname, phone, avatar } = req.body
    const user = await db.User.findByPk(req.user.id)
    if (!user) {
        res.status(404)
        throw new Error('Không tìm thấy user')
    }
    await user.update({
        fullname: fullname ?? user.fullname,
        phone: phone ?? user.phone,
        avatar: avatar ?? user.avatar,
    })
    const safe = user.get({ plain: true })
    delete safe.password
    return res.json({ success: true, data: safe })
})

// PUT /me/password  { oldPassword, newPassword }
const changePassword = asyncHandler(async (req, res) => {
    const { oldPassword, newPassword } = req.body
    if (!oldPassword || !newPassword) {
        res.status(400)
        throw new Error('Thiếu mật khẩu cũ hoặc mới')
    }
    const user = await db.User.findByPk(req.user.id)
    if (!bcrypt.compareSync(oldPassword, user.password)) {
        res.status(400)
        throw new Error('Mật khẩu cũ không đúng')
    }
    await user.update({ password: hashPassword(newPassword) })
    return res.json({ success: true })
})

module.exports = { getMe, updateProfile, changePassword }