const { notFound, errorHandle } = require('../middleware/errorHandle')
const auth = require('./auth.route')
const initRoutes = (app) => {
    app.use('/api/v1/auth', auth)

    app.use(notFound)
    app.use(errorHandle)
}

module.exports = initRoutes
