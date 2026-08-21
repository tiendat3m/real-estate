const asyncHandler = require('express-async-handler')
const jwt = require('jsonwebtoken')
const db = require('../models')

// Bắt buộc đăng nhập — gắn req.user
const protect = asyncHandler(async (req, res, next) => {
    let token
    if (req.headers.authorization?.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1]
    }
    if (!token) {
        res.status(401)
        throw new Error('Không tìm thấy token, vui lòng đăng nhập')
    }
    try {
        const decoded = jwt.verify(token, process.env.SECRET_JWT_KEY)
        const user = await db.User.findByPk(decoded.uid, {
            attributes: { exclude: ['password', 'resetPwdToken', 'resetPwdExpiry'] },
        })
        if (!user) {
            res.status(401)
            throw new Error('Token không hợp lệ, user không tồn tại')
        }
        if (user.userStatus === 'banned') {
            res.status(403)
            throw new Error('Tài khoản đã bị khóa')
        }
        req.user = user
        next()
    } catch (error) {
        res.status(401)
        throw new Error('Token không hợp lệ hoặc đã hết hạn')
    }
})

// Tuỳ chọn — có token thì gắn user, không thì vẫn cho qua
const optionalAuth = asyncHandler(async (req, res, next) => {
    let token
    if (req.headers.authorization?.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1]
    }
    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.SECRET_JWT_KEY)
            const user = await db.User.findByPk(decoded.uid, {
                attributes: { exclude: ['password', 'resetPwdToken', 'resetPwdExpiry'] },
            })
            if (user) req.user = user
        } catch (error) {
            // bỏ qua lỗi token khi optional
        }
    }
    next()
})

// Bắt buộc là admin
const isAdmin = (req, res, next) => {
    if (req.user?.role !== 'admin') {
        res.status(403)
        return next(new Error('Yêu cầu quyền admin'))
    }
    next()
}

module.exports = { protect, optionalAuth, isAdmin }
