'use strict'
const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  class Lead extends Model {
    static associate(models) {
      Lead.belongsTo(models.Post, { foreignKey: 'idPost', as: 'post' })
      Lead.belongsTo(models.User, { foreignKey: 'idUser', as: 'user' })
    }
  }

  Lead.init({
    idPost: DataTypes.INTEGER,
    idUser: DataTypes.INTEGER,
    fullname: DataTypes.STRING,
    phone: DataTypes.STRING,
    email: DataTypes.STRING,
    message: DataTypes.TEXT,
    status: {
      type: DataTypes.ENUM,
      values: ['new', 'contacted', 'qualified', 'closed', 'lost'],
      defaultValue: 'new',
    },
    note: DataTypes.TEXT,
    source: { type: DataTypes.STRING, defaultValue: 'post_detail' },
  }, {
    sequelize,
    modelName: 'Lead',
  })

  return Lead
}
