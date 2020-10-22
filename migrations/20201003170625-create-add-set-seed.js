'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('AddSetSeeds', {
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
      Date: {
        type: Sequelize.STRING
      },
      Number_Seed: {
        type: Sequelize.STRING
      },
      ID_Gen: {
        type: Sequelize.STRING
      },
      Check: {
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
    await queryInterface.dropTable('AddSetSeeds');
  }
};