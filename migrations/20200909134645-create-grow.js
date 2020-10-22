'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Grows', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      ID_Project: {
        type: Sequelize.STRING
      },
      ID_Before: {
        type: Sequelize.STRING
      },
      Date: {
        type: Sequelize.STRING
      },
      Germinate: {
        type: Sequelize.STRING
      },
      Grow: {
        type: Sequelize.STRING
      },
      Area: {
        type: Sequelize.STRING
      },
      Disease: {
        type: Sequelize.STRING
      },
      Product: {
        type: Sequelize.STRING
      },
      Insect: {
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
    await queryInterface.dropTable('Grows');
  }
};