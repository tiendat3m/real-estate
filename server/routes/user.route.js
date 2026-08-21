const router = require('express').Router()
const ctrls = require('../controller/user.controller')
const { protect } = require('../middleware/auth.middleware')
const { uploadAvatar, handleAvatarUpload } = require('../controller/upload.controller')

router.get('/', protect, ctrls.getMe)
router.put('/', protect, ctrls.updateProfile)
router.put('/password', protect, ctrls.changePassword)
router.post('/avatar', protect, uploadAvatar, handleAvatarUpload)

module.exports = router