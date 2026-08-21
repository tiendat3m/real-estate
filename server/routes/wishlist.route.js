const router = require('express').Router()
const ctrls = require('../controller/wishlist.controller')
const { protect } = require('../middleware/auth.middleware')

router.get('/', protect, ctrls.getMine)
router.get('/check/:idPost', protect, ctrls.check)
router.post('/toggle', protect, ctrls.toggle)

module.exports = router