'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('properties', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      name: {
        type: Sequelize.STRING,
      },
      rejection_reason: {
        type: Sequelize.STRING,
      },
      description: {
        type: Sequelize.TEXT,
      },
      total_views: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        allowNull: false,
      },
      phone_get_count: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        allowNull: false,
      },
      party: Sequelize.STRING,
      polygons: Sequelize.ARRAY(Sequelize.INTEGER),
      label_ids: Sequelize.ARRAY(Sequelize.INTEGER),
      place_ids: Sequelize.ARRAY(Sequelize.STRING),
      price_rank: Sequelize.STRING(100),
      owner_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'users',
          key: 'id',
        },
      },
      company_owner_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'companies',
          key: 'id',
        },
      },
      membership_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'memberships',
          key: 'id',
        },
      },

      is_private: {
        allowNull: false,
        defaultValue: false,
        type: Sequelize.BOOLEAN,
      },
      revision: { type: Sequelize.INTEGER, defaultValue: 0, allowNull: false },
      status: {
        type: Sequelize.ENUM,
        values: ['draft', 'active', 'inactive', 'moderation', 'rejected'],
        defaultValue: 'draft',
      },
      market_type: { type: Sequelize.STRING },
      property_type: { type: Sequelize.STRING },
      city: { type: Sequelize.STRING, defaultValue: 'Tashkent', allowNull: false },
      slug: { type: Sequelize.STRING(32), unique: true },
      district: { type: Sequelize.STRING, allowNull: false },
      street: { type: Sequelize.STRING },
      rooms_count: { type: Sequelize.INTEGER },
      total_area: { type: Sequelize.FLOAT },
      living_area: { type: Sequelize.FLOAT },
      floor: { type: Sequelize.INTEGER },
      total_floors: { type: Sequelize.INTEGER },
      build_type: { type: Sequelize.STRING }, // brick panel other
      layout: { type: Sequelize.STRING },
      latlng: { type: Sequelize.GEOMETRY('POINT') },
      bathroom_count: { type: Sequelize.INTEGER },
      ceiling_height: { type: Sequelize.FLOAT },
      per_square_price: { type: Sequelize.FLOAT },

      has_internet: { type: Sequelize.BOOLEAN },
      has_swimming_pool: { type: Sequelize.BOOLEAN },
      has_furnishing: { type: Sequelize.BOOLEAN },
      has_balcony: { type: Sequelize.BOOLEAN },
      has_sauna: { type: Sequelize.BOOLEAN },
      has_sewage: { type: Sequelize.BOOLEAN },
      has_electricity: { type: Sequelize.BOOLEAN },
      has_water: { type: Sequelize.BOOLEAN },
      has_gas: { type: Sequelize.BOOLEAN },

      repair: { type: Sequelize.STRING },
      construction_date: { type: Sequelize.STRING },
      price: { type: Sequelize.INTEGER },
      rent_price: { type: Sequelize.INTEGER },
      rent_type: { type: Sequelize.STRING },

      currency: {
        type: Sequelize.ENUM,
        values: ['USD', 'UZS'],
        defaultValue: 'USD',
      },

      url: {
        type: Sequelize.STRING,
        unique: true,
      },

      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("(now() at time zone 'utc')"),
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("(now() at time zone 'utc')"),
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('properties');
  },
};
