'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Selections', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      ID_Project: {
        type: Sequelize.STRING
      },
      Step: {
        type: Sequelize.STRING
      },
      ID_SproutPlanting: {
        type: Sequelize.STRING
      },
      ID_Main: {
        type: Sequelize.STRING
      },
      Date: {
        type: Sequelize.STRING
      },
      Amount: {
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
    await queryInterface.dropTable('Selections');
  }
};