'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class SST extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  SST.init({
    ID_Project: DataTypes.STRING,
    ID_SST: DataTypes.STRING,
    ID_Father: DataTypes.STRING,
    ID_Mother: DataTypes.STRING,
    Status_SST: DataTypes.STRING,
    ID_Farm: DataTypes.STRING,
    ID_Block: DataTypes.STRING,
    ID_Unit: DataTypes.STRING,
    ID_Seedling: DataTypes.STRING,
    DateSST: DataTypes.STRING,
    FarmName: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'SST',
  });
  return SST;
};