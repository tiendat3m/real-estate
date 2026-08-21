const router = require('express').Router()
const ctrls = require('../controller/report.controller')
const { optionalAuth } = require('../middleware/auth.middleware')

router.post('/', optionalAuth, ctrls.createReport)

module.exports = router
