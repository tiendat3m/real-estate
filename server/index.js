const express = require('express')

const app = express()


app.use('/', (req, res) =>
    res.send('Server On')
)
app.listen(5000, () =>
    console.log('::::::SERVER READY')
)