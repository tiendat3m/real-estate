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
      Post.belongsTo(models.User, { foreignKey: 'idUser', as: 'user' });
      Post.hasMany(models.Comment, { foreignKey: 'idPost', as: 'comments' });
      Post.hasMany(models.Rating, { foreignKey: 'idPost', as: 'ratings' });
      Post.hasMany(models.Lead, { foreignKey: 'idPost', as: 'leads' });
      Post.hasMany(models.Report, { foreignKey: 'idPost', as: 'reports' });
      Post.belongsToMany(models.Tag, {
        through: models.Tag_Post,
        foreignKey: 'idPost',
        otherKey: 'idTag',
        as: 'tags',
      });
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
    images: DataTypes.TEXT,
    views: { type: DataTypes.INTEGER, defaultValue: 0 },
    slug: DataTypes.STRING,
    coverImage: DataTypes.STRING,
    approvalStatus: {
      type: DataTypes.ENUM,
      values: ['pending', 'approved', 'rejected'],
      defaultValue: 'pending',
    },
    availabilityStatus: {
      type: DataTypes.ENUM,
      values: ['available', 'negotiating', 'handed_over', 'hidden'],
      defaultValue: 'available',
    },
    rejectReason: DataTypes.TEXT,
    legalStatus: DataTypes.STRING,
    provinceCode: DataTypes.STRING,
    districtCode: DataTypes.STRING,
    wardCode: DataTypes.STRING,
    latitude: DataTypes.DECIMAL(10, 7),
    longitude: DataTypes.DECIMAL(10, 7),
    isFeatured: { type: DataTypes.BOOLEAN, defaultValue: false },
    isBoosted: { type: DataTypes.BOOLEAN, defaultValue: false },
    featuredUntil: DataTypes.DATE,
    boostedUntil: DataTypes.DATE,
  }, {
    sequelize,
    modelName: 'Post',
  });
  return Post;
};
