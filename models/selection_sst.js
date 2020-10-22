'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Selection_SST extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Selection_SST.init({
    ID_Project: DataTypes.STRING,
    ID_Selection: DataTypes.STRING,
    ID_SST: DataTypes.STRING,
    Date: DataTypes.STRING,
    Amount: DataTypes.STRING,
    ID_Farm: DataTypes.STRING,
    ID_Block: DataTypes.STRING,
    ID_Unit: DataTypes.STRING,
    FarmName: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Selection_SST',
  });
  return Selection_SST;
};