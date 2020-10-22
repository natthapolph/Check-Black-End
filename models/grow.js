'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Grow extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Grow.init({
    ID_Project: DataTypes.STRING,
    ID_Before: DataTypes.STRING,
    Date: DataTypes.STRING,
    Germinate: DataTypes.STRING,
    Grow: DataTypes.STRING,
    Area: DataTypes.STRING,
    Disease: DataTypes.STRING,
    Product: DataTypes.STRING,
    Insect: DataTypes.STRING,
    ID_Grow: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Grow',
  });
  return Grow;
};