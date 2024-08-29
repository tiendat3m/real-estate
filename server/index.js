const express = require('express')
require('dotenv').config()
const app = express()
const cors = require('cors')
const dbConnect = require('./config/dbconnect')
const PORT = process.env.PORT || 7777

app.use(cors({
    origin: process.env.CLIENT_URL,
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

dbConnect()

app.listen(PORT, () =>
    console.log('::::::SERVER READY ON PORT: ' + PORT)
)