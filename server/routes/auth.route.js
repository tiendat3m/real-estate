const router = require('express').Router()
const ctrls = require('../controller/auth.controller')
const { protect } = require('../middleware/auth.middleware')

router.post('/register', ctrls.register)
router.post('/login', ctrls.login)
router.post('/test', ctrls.loginWithGoogle) // Google login (giữ tên cũ)
router.get('/has-user/:email', ctrls.checkNewUser)
router.get('/me', protect, ctrls.getMe)

module.exports = router