'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Comment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Comment.belongsTo(models.Post, { foreignKey: 'idPost', as: 'post' });
      Comment.belongsTo(models.User, { foreignKey: 'idUser', as: 'user' });
      Comment.belongsTo(models.Comment, { foreignKey: 'idParent', as: 'parent' });
      Comment.hasMany(models.Comment, { foreignKey: 'idParent', as: 'replies' });
    }
  }
  Comment.init({
    idPost: DataTypes.INTEGER,
    idUser: DataTypes.INTEGER,
    idParent: DataTypes.INTEGER,
    content: DataTypes.TEXT,
  }, {
    sequelize,
    modelName: 'Comment',
  });
  return Comment;
};