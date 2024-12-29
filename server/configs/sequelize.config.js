require('dotenv').config()

const checkEnv = () => {
    if (!process.env.DB_USERNAME || !process.env.DB_PASSWORD || !process.env.DB_NAME || !process.env.DB_DIALECT || !process.env.DB_HOST) {
        console.error('Missing required environment variables for database configuration.');
        process.exit(1);
    }
};

checkEnv();

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