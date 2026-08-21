const router = require('express').Router()
const ctrls = require('../controller/admin.controller')
const { protect, isAdmin } = require('../middleware/auth.middleware')

router.get('/stats', ctrls.stats)
router.get('/posts', ctrls.listPosts)
router.put('/posts/:id/status', ctrls.updatePostStatus)
router.delete('/posts/:id', ctrls.deletePost)
router.get('/users', ctrls.listUsers)
router.put('/users/:id/role', ctrls.setUserRole)
router.get('/leads', ctrls.listLeads)
router.put('/leads/:id', ctrls.updateLead)
router.get('/reports', ctrls.listReports)
router.put('/reports/:id', ctrls.updateReport)

module.exports = router
