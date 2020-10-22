'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class AddSetSeed extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  AddSetSeed.init({
    ID_Project: DataTypes.STRING,
    ID_Seed: DataTypes.STRING,
    Date: DataTypes.STRING,
    Number_Seed: DataTypes.STRING,
    ID_Gen: DataTypes.STRING,
    Check: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'AddSetSeed',
  });
  return AddSetSeed;
};