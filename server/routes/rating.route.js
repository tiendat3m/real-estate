const router = require('express').Router()
const ctrls = require('../controller/rating.controller')
const { protect } = require('../middleware/auth.middleware')

router.get('/post/:idPost', ctrls.getByPost)
router.post('/', protect, ctrls.upsert)
router.delete('/:id', protect, ctrls.remove)

module.exports = router