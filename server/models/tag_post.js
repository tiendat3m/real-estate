'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Tag_Post extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Tag_Post.belongsTo(models.Post, { foreignKey: 'idPost', as: 'post' });
      Tag_Post.belongsTo(models.Tag, { foreignKey: 'idTag', as: 'tag' });
    }
  }
  Tag_Post.init({
    idPost: DataTypes.INTEGER,
    idTag: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'Tag_Post',
  });
  return Tag_Post;
};