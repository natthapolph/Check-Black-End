'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('SSTs', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      ID_Project: {
        type: Sequelize.STRING
      },
      ID_SST: {
        type: Sequelize.STRING
      },
      ID_Father: {
        type: Sequelize.STRING
      },
      ID_Mother: {
        type: Sequelize.STRING
      },
      Status_SST: {
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
      ID_Seedling: {
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
    await queryInterface.dropTable('SSTs');
  }
};