'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      User.hasMany(models.Post, { foreignKey: 'idUser', as: 'posts' });
      User.hasMany(models.Comment, { foreignKey: 'idUser', as: 'comments' });
      User.hasMany(models.Rating, { foreignKey: 'idUser', as: 'ratings' });
      User.hasMany(models.Wishlist, { foreignKey: 'idUser', as: 'wishlists' });
      User.hasMany(models.Lead, { foreignKey: 'idUser', as: 'leads' });
      User.hasMany(models.Report, { foreignKey: 'idUser', as: 'reports' });
    }
  }
  User.init({
    email: DataTypes.STRING,
    phone: DataTypes.STRING,
    fullname: DataTypes.STRING,
    emailVerified: DataTypes.BOOLEAN,
    phoneVerified: DataTypes.BOOLEAN,
    password: DataTypes.STRING,
    avatar: DataTypes.STRING,
    balance: DataTypes.BIGINT,
    score: DataTypes.INTEGER,
    resetPwdToken: DataTypes.STRING,
    resetPwdExpiry: DataTypes.DATE,
    idPricing: DataTypes.INTEGER,
    role: {
      type: DataTypes.ENUM,
      values: ['user', 'admin'],
      defaultValue: 'user',
    },
    userStatus: {
      type: DataTypes.ENUM,
      values: ['active', 'banned'],
      defaultValue: 'active',
    },
    verifiedAgent: { type: DataTypes.BOOLEAN, defaultValue: false },
    companyName: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};
