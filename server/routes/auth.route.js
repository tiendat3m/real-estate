const router = require('express').Router()
const ctrls = require('../controller/auth.controller')
router.post('/test', ctrls.loginWithGoogle)

module.exports = router

