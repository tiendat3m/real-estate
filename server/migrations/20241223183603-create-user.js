'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      email: {
        type: Sequelize.STRING
      },
      phone: {
        type: Sequelize.STRING
      },
      fullname: {
        type: Sequelize.STRING,
        allowNull: false
      },
      emailVerified: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      phoneVerified: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false
      },
      avatar: {
        type: Sequelize.STRING,
      },
      balance: {
        type: Sequelize.BIGINT,
        defaultValue: 0
      },
      score: {
        type: Sequelize.STRING,
        defaultValue: 0
      },
      resetPwdToken: {
        type: Sequelize.STRING,
      },
      resetPwdExpiry: {
        type: Sequelize.STRING,
      },
      idPricing: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Pricings', // Table name
          key: 'id'          // Column name
        }
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Users');
  }
};