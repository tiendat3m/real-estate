require('dotenv').config()

module.exports = {
    development: {
        username: process.env.DB_USERNAME,
        database: process.env.DB_NAME,
        password: process.env.DB_PASSWORD,
        dialect: process.env.DB_DIALECT,
        host: process.env.DB_HOST,
        logging: false,
        timezone: '+07'
    },
    production: {
        username: process.env.DB_USERNAME,
        database: process.env.DB_NAME,
        password: process.env.DB_PASSWORD,
        dialect: process.env.DB_DIALECT,
        host: process.env.DB_HOST,
        logging: false,
        timezone: '+07',
        dialectOptions: {
            ssl: {
                require: true,
                rejectUnauthorized: false,
            }
        }
    }
}