const errorHandle = (error, req, res, next) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode
    const message = error?.message?.replaceAll(`\"`, '')

    return res.status(statusCode).json({
        success: false,
        msg: message
    })
}

const notFound = (req, res, next) => {
    const error = new Error(`Route ${req.originalUrl} not found`)

    res.status(403)
    next(error)
}


module.exports = {
    notFound,
    errorHandle
}