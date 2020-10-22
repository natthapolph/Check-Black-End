'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Selection_SSTs', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      ID_Project: {
        type: Sequelize.STRING
      },
      ID_Selection: {
        type: Sequelize.STRING
      },
      ID_SST: {
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
    await queryInterface.dropTable('Selection_SSTs');
  }
};