'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Breedings', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      ID_Project: {
        type: Sequelize.STRING
      },
      ID_Breeding: {
        type: Sequelize.STRING
      },
      ID_Father: {
        type: Sequelize.STRING
      },
      ID_Mother: {
        type: Sequelize.STRING
      },
      Date_Breeding: {
        type: Sequelize.STRING
      },
      ID_Farm: {
        type: Sequelize.STRING
      },
      Type_Breeding: {
        type: Sequelize.STRING
      },
      Self_Round: {
        type: Sequelize.STRING
      },
      Flower_Num: {
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
    await queryInterface.dropTable('Breedings');
  }
};