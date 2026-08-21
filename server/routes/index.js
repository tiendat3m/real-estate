const { notFound, errorHandle } = require('../middleware/errorHandle')
const auth = require('./auth.route')
const post = require('./post.route')
const rating = require('./rating.route')
const comment = require('./comment.route')
const wishlist = require('./wishlist.route')
const user = require('./user.route')
const admin = require('./admin.route')
const lead = require('./lead.route')
const report = require('./report.route')
const { protect, isAdmin } = require('../middleware/auth.middleware')

const initRoutes = (app) => {
    app.use('/api/v1/auth', auth)
    app.use('/api/v1/post', post)
    app.use('/api/v1/rating', rating)
    app.use('/api/v1/comment', comment)
    app.use('/api/v1/wishlist', wishlist)
    app.use('/api/v1/lead', lead)
    app.use('/api/v1/report', report)
    app.use('/api/v1/me', user)
    app.use('/api/v1/admin', protect, isAdmin, admin)

    app.use(notFound)
    app.use(errorHandle)
}

module.exports = initRoutes
