'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('CheckVarieties', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      ID_Project: {
        type: Sequelize.STRING
      },
      code: {
        type: Sequelize.STRING
      },
      ID_Breeder: {
        type: Sequelize.STRING
      },
      Date: {
        type: Sequelize.STRING
      },
      Amount: {
        type: Sequelize.STRING
      },
      ID_Farm: {
        type: Sequelize.STRING
      },
      ID_Block: {
        type: Sequelize.STRING
      },
      ID_Unit: {
        type: Sequelize.STRING
      },
      Rep_ID: {
        type: Sequelize.STRING
      },
      ID_Compare: {
        type: Sequelize.STRING
      },
      FarmName: {
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
    await queryInterface.dropTable('CheckVarieties');
  }
};