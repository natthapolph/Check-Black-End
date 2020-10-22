'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Seedlings', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      ID_Project: {
        type: Sequelize.STRING
      },
      ID_Seedling: {
        type: Sequelize.STRING
      },
      ID_Seed: {
        type: Sequelize.STRING
      },
      Number_Seed: {
        type: Sequelize.STRING
      },
      Date_Seed: {
        type: Sequelize.STRING
      },
      Location_Seedling: {
        type: Sequelize.STRING
      },
      Grow_Number: {
        type: Sequelize.STRING
      },
      ID_Breeding: {
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
    await queryInterface.dropTable('Seedlings');
  }
};