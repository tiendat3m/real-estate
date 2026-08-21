'use strict';
const { enumData } = require('../utils/constants');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // 1. sửa typo distric -> district
    await queryInterface.renameColumn('Posts', 'distric', 'district');

    // 2. nới null cho idPost / expiredBoost (seed/ứng dụng không luôn set)
    await queryInterface.changeColumn('Posts', 'idPost', { type: Sequelize.STRING, allowNull: true });
    await queryInterface.changeColumn('Posts', 'expiredBoost', { type: Sequelize.DATE, allowNull: true });
    await queryInterface.changeColumn('Posts', 'expiredDate', { type: Sequelize.DATE, allowNull: true });

    // 3. status: BOOLEAN sai kiểu -> ENUM (bảng Posts đang rỗng ở dev)
    await queryInterface.removeColumn('Posts', 'status');
    await queryInterface.addColumn('Posts', 'status', {
      type: Sequelize.ENUM(enumData.postStatus),
      defaultValue: 'Còn trống',
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Posts', 'status');
    await queryInterface.addColumn('Posts', 'status', { type: Sequelize.BOOLEAN, defaultValue: false });
    await queryInterface.changeColumn('Posts', 'expiredDate', { type: Sequelize.DATE, allowNull: false });
    await queryInterface.changeColumn('Posts', 'expiredBoost', { type: Sequelize.DATE, allowNull: false });
    await queryInterface.changeColumn('Posts', 'idPost', { type: Sequelize.STRING, allowNull: false });
    await queryInterface.renameColumn('Posts', 'district', 'distric');
  }
};