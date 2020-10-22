'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Breeding extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Breeding.init({
    ID_Project: DataTypes.STRING,
    ID_Breeding: DataTypes.STRING,
    ID_Father: DataTypes.STRING,
    ID_Mother: DataTypes.STRING,
    Date_Breeding: DataTypes.STRING,
    ID_Farm: DataTypes.STRING,
    Type_Breeding: DataTypes.STRING,
    Self_Round: DataTypes.STRING,
    Flower_Num: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Breeding',
  });
  return Breeding;
};