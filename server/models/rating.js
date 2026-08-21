'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Rating extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Rating.belongsTo(models.Post, { foreignKey: 'idPost', as: 'post' });
      Rating.belongsTo(models.User, { foreignKey: 'idUser', as: 'user' });
    }
  }
  Rating.init({
    idPost: DataTypes.INTEGER,
    idUser: DataTypes.INTEGER,
    content: DataTypes.TEXT,
    star: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Rating',
  });
  return Rating;
};