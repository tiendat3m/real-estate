const { Sequelize } = require('sequelize');

const dbName = process.env.DB_NAME
const dbUserName = process.env.DB_USERNAME
const dbPassword = process.env.DB_PASSWORD
const dbHost = process.env.DB_HOST
const dbDialect = process.env.DB_DIALECT

// Passing parameters separately (other dialects)
const sequelize = new Sequelize(dbName, dbUserName, dbPassword, {
    host: dbHost,
    dialect: dbDialect,
    logging: false,
})

const connectDatabase = async () => {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
}

module.exports = {
    connectDatabase
}
