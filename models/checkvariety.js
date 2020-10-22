'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class CheckVariety extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  CheckVariety.init({
    ID_Project: DataTypes.STRING,
    code: DataTypes.STRING,
    ID_Breeder: DataTypes.STRING,
    Date: DataTypes.STRING,
    Amount: DataTypes.STRING,
    ID_Farm: DataTypes.STRING,
    ID_Block: DataTypes.STRING,
    ID_Unit: DataTypes.STRING,
    Rep_ID: DataTypes.STRING,
    ID_Compare: DataTypes.STRING,
    FarmName: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'CheckVariety',
  });
  return CheckVariety;
};