'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Project_Farm extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Project_Farm.init({
    ID_Project: DataTypes.STRING,
    ID_Farm: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Project_Farm',
  });
  return Project_Farm;
};