'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Selection_Groups', {
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
      ID_Set: {
        type: Sequelize.STRING
      },
      ToTalAmout: {
        type: Sequelize.STRING
      },
      SumID: {
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
    await queryInterface.dropTable('Selection_Groups');
  }
};