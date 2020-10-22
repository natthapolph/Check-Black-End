'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class datatest extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  datatest.init({
    ID_user: DataTypes.STRING,
    Email: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'datatest',
  });
  return datatest;
};