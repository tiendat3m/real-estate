const asyncHandler = require('express-async-handler')
const db = require('../models')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const hashPassword = (password) => bcrypt.hashSync(password, bcrypt.genSaltSync(10))


module.exports = {
    loginWithGoogle: asyncHandler(async (req, res) => {
        const { email, fullname, avatar, password } = req.body

        let uid

        const alreadyUser = await db.User.findOne({ where: { email } })

        if (!alreadyUser) {
            const newUser = await db.newUser.create({ email, fullname, avatar, password: hashPassword(password) })
            if (!newUser) {
                throw new Error('Lỗi tạo mới user')
            } else {
                uid = user.id
            }
        }
        uid = alreadyUser.id
        const token = jwt.sign({ uid }, process.env.SECRET_JWT_KEY, { expiresIn: '7d' })

        return res.json({
            success: !!token,
            accessToken: token,
        })
    })
}