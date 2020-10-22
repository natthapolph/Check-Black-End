'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Massages', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      ID_user: {
        type: Sequelize.STRING
      },
      Email: {
        type: Sequelize.STRING
      },
      ID_Project: {
        type: Sequelize.STRING
      },
      ProjectName: {
        type: Sequelize.STRING
      },
      Status: {
        type: Sequelize.STRING
      },
      Massage: {
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
    await queryInterface.dropTable('Massages');
  }
};