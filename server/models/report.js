'use strict'
const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  class Report extends Model {
    static associate(models) {
      Report.belongsTo(models.Post, { foreignKey: 'idPost', as: 'post' })
      Report.belongsTo(models.User, { foreignKey: 'idUser', as: 'user' })
    }
  }

  Report.init({
    idPost: DataTypes.INTEGER,
    idUser: DataTypes.INTEGER,
    reason: DataTypes.STRING,
    description: DataTypes.TEXT,
    status: {
      type: DataTypes.ENUM,
      values: ['pending', 'resolved', 'rejected'],
      defaultValue: 'pending',
    },
  }, {
    sequelize,
    modelName: 'Report',
  })

  return Report
}
