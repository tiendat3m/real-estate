'use strict'

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.addColumn('Posts', 'slug', { type: Sequelize.STRING, allowNull: true }, { transaction })
      await queryInterface.addColumn('Posts', 'coverImage', { type: Sequelize.STRING, allowNull: true }, { transaction })
      await queryInterface.addColumn('Posts', 'approvalStatus', {
        type: Sequelize.ENUM('pending', 'approved', 'rejected'),
        allowNull: false,
        defaultValue: 'approved',
      }, { transaction })
      await queryInterface.addColumn('Posts', 'availabilityStatus', {
        type: Sequelize.ENUM('available', 'negotiating', 'handed_over', 'hidden'),
        allowNull: false,
        defaultValue: 'available',
      }, { transaction })
      await queryInterface.addColumn('Posts', 'rejectReason', { type: Sequelize.TEXT, allowNull: true }, { transaction })
      await queryInterface.addColumn('Posts', 'legalStatus', { type: Sequelize.STRING, allowNull: true }, { transaction })
      await queryInterface.addColumn('Posts', 'provinceCode', { type: Sequelize.STRING, allowNull: true }, { transaction })
      await queryInterface.addColumn('Posts', 'districtCode', { type: Sequelize.STRING, allowNull: true }, { transaction })
      await queryInterface.addColumn('Posts', 'wardCode', { type: Sequelize.STRING, allowNull: true }, { transaction })
      await queryInterface.addColumn('Posts', 'latitude', { type: Sequelize.DECIMAL(10, 7), allowNull: true }, { transaction })
      await queryInterface.addColumn('Posts', 'longitude', { type: Sequelize.DECIMAL(10, 7), allowNull: true }, { transaction })
      await queryInterface.addColumn('Posts', 'isFeatured', { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false }, { transaction })
      await queryInterface.addColumn('Posts', 'isBoosted', { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false }, { transaction })
      await queryInterface.addColumn('Posts', 'featuredUntil', { type: Sequelize.DATE, allowNull: true }, { transaction })
      await queryInterface.addColumn('Posts', 'boostedUntil', { type: Sequelize.DATE, allowNull: true }, { transaction })

      await queryInterface.addColumn('Users', 'userStatus', {
        type: Sequelize.ENUM('active', 'banned'),
        allowNull: false,
        defaultValue: 'active',
      }, { transaction })
      await queryInterface.addColumn('Users', 'verifiedAgent', { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false }, { transaction })
      await queryInterface.addColumn('Users', 'companyName', { type: Sequelize.STRING, allowNull: true }, { transaction })

      await queryInterface.createTable('Leads', {
        id: { allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER },
        idPost: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: { model: 'Posts', key: 'id' },
          onDelete: 'CASCADE',
        },
        idUser: {
          type: Sequelize.INTEGER,
          allowNull: true,
          references: { model: 'Users', key: 'id' },
          onDelete: 'SET NULL',
        },
        fullname: { type: Sequelize.STRING, allowNull: false },
        phone: { type: Sequelize.STRING, allowNull: false },
        email: { type: Sequelize.STRING, allowNull: true },
        message: { type: Sequelize.TEXT, allowNull: true },
        status: {
          type: Sequelize.ENUM('new', 'contacted', 'qualified', 'closed', 'lost'),
          allowNull: false,
          defaultValue: 'new',
        },
        note: { type: Sequelize.TEXT, allowNull: true },
        source: { type: Sequelize.STRING, allowNull: false, defaultValue: 'post_detail' },
        createdAt: { allowNull: false, type: Sequelize.DATE },
        updatedAt: { allowNull: false, type: Sequelize.DATE },
      }, { transaction })

      await queryInterface.createTable('Reports', {
        id: { allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER },
        idPost: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: { model: 'Posts', key: 'id' },
          onDelete: 'CASCADE',
        },
        idUser: {
          type: Sequelize.INTEGER,
          allowNull: true,
          references: { model: 'Users', key: 'id' },
          onDelete: 'SET NULL',
        },
        reason: { type: Sequelize.STRING, allowNull: false },
        description: { type: Sequelize.TEXT, allowNull: true },
        status: {
          type: Sequelize.ENUM('pending', 'resolved', 'rejected'),
          allowNull: false,
          defaultValue: 'pending',
        },
        createdAt: { allowNull: false, type: Sequelize.DATE },
        updatedAt: { allowNull: false, type: Sequelize.DATE },
      }, { transaction })

      await queryInterface.addIndex('Posts', ['slug'], { unique: true, transaction })
      await queryInterface.addIndex('Posts', ['approvalStatus'], { transaction })
      await queryInterface.addIndex('Posts', ['availabilityStatus'], { transaction })
      await queryInterface.addIndex('Leads', ['idPost'], { transaction })
      await queryInterface.addIndex('Reports', ['idPost'], { transaction })
    })
  },

  async down(queryInterface) {
    await queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.dropTable('Reports', { transaction })
      await queryInterface.dropTable('Leads', { transaction })
      await queryInterface.removeIndex('Posts', ['slug'], { transaction }).catch(() => {})
      await queryInterface.removeColumn('Users', 'companyName', { transaction })
      await queryInterface.removeColumn('Users', 'verifiedAgent', { transaction })
      await queryInterface.removeColumn('Users', 'userStatus', { transaction })
      await queryInterface.removeColumn('Posts', 'boostedUntil', { transaction })
      await queryInterface.removeColumn('Posts', 'featuredUntil', { transaction })
      await queryInterface.removeColumn('Posts', 'isBoosted', { transaction })
      await queryInterface.removeColumn('Posts', 'isFeatured', { transaction })
      await queryInterface.removeColumn('Posts', 'longitude', { transaction })
      await queryInterface.removeColumn('Posts', 'latitude', { transaction })
      await queryInterface.removeColumn('Posts', 'wardCode', { transaction })
      await queryInterface.removeColumn('Posts', 'districtCode', { transaction })
      await queryInterface.removeColumn('Posts', 'provinceCode', { transaction })
      await queryInterface.removeColumn('Posts', 'legalStatus', { transaction })
      await queryInterface.removeColumn('Posts', 'rejectReason', { transaction })
      await queryInterface.removeColumn('Posts', 'availabilityStatus', { transaction })
      await queryInterface.removeColumn('Posts', 'approvalStatus', { transaction })
      await queryInterface.removeColumn('Posts', 'coverImage', { transaction })
      await queryInterface.removeColumn('Posts', 'slug', { transaction })
      await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_Posts_approvalStatus";', { transaction })
      await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_Posts_availabilityStatus";', { transaction })
      await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_Users_userStatus";', { transaction })
      await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_Leads_status";', { transaction })
      await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_Reports_status";', { transaction })
    })
  },
}
