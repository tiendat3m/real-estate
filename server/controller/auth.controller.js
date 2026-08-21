const asyncHandler = require('express-async-handler')
const db = require('../models')
const { Op } = require('sequelize')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const hashPassword = (password) => bcrypt.hashSync(password, bcrypt.genSaltSync(10))

const signToken = (uid) => jwt.sign({ uid }, process.env.SECRET_JWT_KEY, { expiresIn: '7d' })

module.exports = {
    // Đăng ký bằng email + password
    register: asyncHandler(async (req, res) => {
        const { email, password, fullname, phone } = req.body
        if (!email || !password || !fullname) {
            res.status(400)
            throw new Error('Thiếu email, password hoặc fullname')
        }
        const exists = await db.User.findOne({ where: { email } })
        if (exists) {
            res.status(409)
            throw new Error('Email đã được đăng ký')
        }
        const newUser = await db.User.create({
            email,
            password: hashPassword(password),
            fullname,
            phone: phone || null,
            emailVerified: false,
        })
        const token = signToken(newUser.id)
        return res.json({
            success: true,
            accessToken: token,
            user: newUser.get({ plain: true }),
        })
    }),

    // Đăng nhập bằng email/phone + password
    login: asyncHandler(async (req, res) => {
        const { emailOrPhone, password } = req.body
        if (!emailOrPhone || !password) {
            res.status(400)
            throw new Error('Thiếu thông tin đăng nhập')
        }
        const user = await db.User.findOne({
            where: { [Op.or]: [{ email: emailOrPhone }, { phone: emailOrPhone }] },
        })
        if (!user) {
            res.status(401)
            throw new Error('Tài khoản không tồn tại')
        }
        const match = bcrypt.compareSync(password, user.password)
        if (!match) {
            res.status(401)
            throw new Error('Mật khẩu không đúng')
        }
        const token = signToken(user.id)
        const safe = user.get({ plain: true })
        delete safe.password
        return res.json({ success: true, accessToken: token, user: safe })
    }),

    // Đăng nhập / tạo user bằng Google
    loginWithGoogle: asyncHandler(async (req, res) => {
        const { email, fullname, avatar, password } = req.body
        let uid

        const alreadyUser = await db.User.findOne({ where: { email } })

        if (alreadyUser) {
            uid = alreadyUser.id
        } else {
            const newUser = await db.User.create({ email, fullname, avatar, password: hashPassword(password || 'google-oauth') })
            if (!newUser) {
                throw new Error('Lỗi tạo mới user')
            }
            uid = newUser.id
        }
        const token = signToken(uid)
        return res.json({ success: !!token, accessToken: token })
    }),

    checkNewUser: asyncHandler(async (req, res) => {
        const { email } = req.params
        const user = await db.User.findOne({ where: { email } })
        return res.json({ success: true, hasUser: !!user })
    }),

    // Lấy thông tin user hiện tại
    getMe: asyncHandler(async (req, res) => {
        return res.json({ success: true, user: req.user })
    }),
}