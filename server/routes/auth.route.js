const router = require('express').Router()
const ctrls = require('../controller/auth.controller')
router.post('/test', ctrls.loginWithGoogle)
router.get('/has-user/:email', ctrls.checkNewUser)

module.exports = router

