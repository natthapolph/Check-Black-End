'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Stem_Plantations', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      ID_Project: {
        type: Sequelize.STRING
      },
      ID_Stem: {
        type: Sequelize.STRING
      },
      Step: {
        type: Sequelize.STRING
      },
      ID_Previous: {
        type: Sequelize.STRING
      },
      ID_SproutPlanting: {
        type: Sequelize.STRING
      },
      Date: {
        type: Sequelize.STRING
      },
      ID_Farm: {
        type: Sequelize.STRING
      },
      FarmName: {
        type: Sequelize.STRING
      },
      ID_Block: {
        type: Sequelize.STRING
      },
      ID_Unit: {
        type: Sequelize.STRING
      },
      ID_Rep: {
        type: Sequelize.STRING
      },
      Count: {
        type: Sequelize.STRING
      },
      ID_Set: {
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
    await queryInterface.dropTable('Stem_Plantations');
  }
};