'use strict';
const {
  Model
} = require('sequelize');
const { enumData } = require('../utils/constants');
module.exports = (sequelize, DataTypes) => {
  class Post extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Post.init({
    idPost: DataTypes.STRING,
    title: DataTypes.STRING,
    address: DataTypes.STRING,
    province: DataTypes.STRING,
    district: DataTypes.STRING,
    ward: DataTypes.STRING,
    avgScore: DataTypes.FLOAT,
    price: DataTypes.BIGINT,
    size: DataTypes.INTEGER,
    priceUnit: DataTypes.BIGINT,
    description: DataTypes.TEXT,
    floor: DataTypes.INTEGER,
    bathroom: DataTypes.INTEGER,
    bedroom: DataTypes.INTEGER,
    isFurniture: DataTypes.BOOLEAN,
    listingType: {
      type: DataTypes.ENUM,
      values: enumData.listingTypes,
    },
    propertyType: {
      type: DataTypes.ENUM,
      values: enumData.propertyType,
    },
    direction: {
      type: DataTypes.ENUM,
      values: enumData.directions,
    },
    balonDirection: {
      type: DataTypes.ENUM,
      values: enumData.directions,
    },
    status: {
      type: DataTypes.ENUM,
      values: enumData.postStatus,
    },
    verified: DataTypes.BOOLEAN,
    expiredDate: DataTypes.DATE,
    expiredBoost: DataTypes.DATE,
    address: DataTypes.STRING,
    idUser: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'Post',
  });
  return Post;
};