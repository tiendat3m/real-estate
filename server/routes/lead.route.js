const router = require('express').Router()
const ctrls = require('../controller/lead.controller')
const { protect, optionalAuth } = require('../middleware/auth.middleware')

router.post('/', optionalAuth, ctrls.createLead)
router.get('/mine', protect, ctrls.getMine)
router.put('/:id', protect, ctrls.updateLead)

module.exports = router
