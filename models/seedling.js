'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Seedling extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Seedling.init({
    ID_Project: DataTypes.STRING,
    ID_Seedling: DataTypes.STRING,
    ID_Seed: DataTypes.STRING,
    Number_Seed: DataTypes.STRING,
    Date_Seed: DataTypes.STRING,
    Location_Seedling: DataTypes.STRING,
    Grow_Number: DataTypes.STRING,
    NumtoSST: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Seedling',
  });
  return Seedling;
};