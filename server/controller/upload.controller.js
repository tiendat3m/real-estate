const asyncHandler = require('express-async-handler')
const path = require('path')
const fs = require('fs')
const multer = require('multer')

const uploadDir = path.join(__dirname, '..', 'public', 'uploads')
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true })

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadDir),
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname) || '.jpg'
        const base = path.basename(file.originalname, ext).replace(/\s+/g, '-').slice(0, 20)
        const unique = Date.now() + '-' + Math.round(Math.random() * 1e9)
        cb(null, `${base}-${unique}${ext}`)
    },
})

const fileFilter = (req, file, cb) => {
    const allowed = /jpeg|jpg|png|webp|gif/
    const ok = allowed.test(path.extname(file.originalname).toLowerCase()) && allowed.test(file.mimetype)
    if (ok) cb(null, true)
    else cb(new Error('Chỉ hỗ trợ file ảnh (jpg, png, webp, gif)'))
}

const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB / ảnh
})

// Middleware upload nhiều ảnh (field name "images")
const uploadImages = upload.array('images', 10)

// Trả về mảng URL tuyệt đối
const handleUpload = asyncHandler(async (req, res) => {
    const baseUrl = process.env.SERVER_URL || ''
    const files = req.files || []
    const urls = files.map((f) => `${baseUrl}/static/${f.filename}`)
    return res.json({ success: true, urls })
})

// Upload 1 ảnh avatar (field name "avatar")
const uploadAvatar = upload.single('avatar')
const handleAvatarUpload = asyncHandler(async (req, res) => {
    const baseUrl = process.env.SERVER_URL || ''
    if (!req.file) {
        res.status(400)
        throw new Error('Không có file ảnh')
    }
    return res.json({ success: true, url: `${baseUrl}/static/${req.file.filename}` })
})

module.exports = { uploadImages, handleUpload, uploadAvatar, handleAvatarUpload }