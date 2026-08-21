const asyncHandler = require('express-async-handler')
const db = require('../models')

const createReport = asyncHandler(async (req, res) => {
    const { idPost, reason, description } = req.body
    if (!idPost || !reason) {
        res.status(400)
        throw new Error('Vui lòng chọn lý do báo cáo')
    }
    const post = await db.Post.findByPk(idPost)
    if (!post) {
        res.status(404)
        throw new Error('Không tìm thấy tin đăng')
    }
    const report = await db.Report.create({
        idPost,
        idUser: req.user?.id || null,
        reason,
        description,
    })
    return res.json({ success: true, data: report })
})

module.exports = { createReport }
