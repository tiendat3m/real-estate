require('dotenv').config()
const path = require('path')
const cors = require('cors')
const express = require('express')
const { connectDatabase } = require('./configs/dbConnect')
const initRoutes = require('./routes')

const app = express()

app.use(cors({
    origin: process.env.CLIENT_URL,
    methods: ['POST', 'PUT', 'DELETE', 'GET'],
}))

app.use(express.json({ limit: '5mb' }))
app.use(express.urlencoded({ extended: true, limit: '5mb' }))

// Serve ảnh tĩnh từ public/uploads
app.use('/static', express.static(path.join(__dirname, 'public', 'uploads')))

connectDatabase()
initRoutes(app)

const port = process.env.PORT || 8888

app.listen(port, () => {
    console.log(`::::Server on ${port}`)
})