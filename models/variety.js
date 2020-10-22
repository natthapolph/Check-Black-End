'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Variety extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Variety.init({
    ID_Breeder: DataTypes.STRING,
    ID_Project: DataTypes.STRING,
    BreederName: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Variety',
  });
  return Variety;
};