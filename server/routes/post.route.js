const router = require('express').Router()
const ctrls = require('../controller/post.controller')
const { protect, optionalAuth } = require('../middleware/auth.middleware')
const { uploadImages, handleUpload } = require('../controller/upload.controller')

// Public
router.get('/featured', ctrls.getFeatured)
router.get('/me', protect, ctrls.getMyPosts)
router.get('/', ctrls.getPosts)
router.get('/:id/related', ctrls.getRelated)
router.get('/:id', optionalAuth, ctrls.getPostById)

// Upload ảnh (yêu cầu đăng nhập)
router.post('/upload', protect, uploadImages, handleUpload)

// CRUD (yêu cầu đăng nhập)
router.post('/', protect, ctrls.createPost)
router.put('/:id', protect, ctrls.updatePost)
router.delete('/:id', protect, ctrls.deletePost)

module.exports = router
