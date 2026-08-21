'use strict'

const values = ['Phòng trọ', 'Nhà nguyên căn', 'Ở ghép', 'Homestay']

module.exports = {
  async up(queryInterface) {
    for (const value of values) {
      await queryInterface.sequelize.query(`ALTER TYPE "enum_Posts_propertyType" ADD VALUE IF NOT EXISTS '${value}';`)
    }
  },

  async down() {
    // PostgreSQL cannot safely remove enum values without recreating the type.
  },
}
