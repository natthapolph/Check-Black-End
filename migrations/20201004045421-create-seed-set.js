'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Seed_Sets', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      ID_Project: {
        type: Sequelize.STRING
      },
      ID_Seed: {
        type: Sequelize.STRING
      },
      ID_Breeding: {
        type: Sequelize.STRING
      },
      Number_Seed: {
        type: Sequelize.STRING
      },
      Date_Seed: {
        type: Sequelize.STRING
      },
      ID_Gen: {
        type: Sequelize.STRING
      },
      check: {
        type: Sequelize.STRING
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
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Seed_Sets');
  }
};