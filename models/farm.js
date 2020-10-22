'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Farm extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Farm.init({
    ID_Farm: DataTypes.STRING,
    ID_User: DataTypes.STRING,
    FarmName: DataTypes.STRING,
    Location: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Farm',
  });
  return Farm;
};