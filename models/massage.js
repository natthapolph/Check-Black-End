'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Massage extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Massage.init({
    ID_user: DataTypes.STRING,
    Email: DataTypes.STRING,
    ID_Project: DataTypes.STRING,
    ProjectName: DataTypes.STRING,
    Status: DataTypes.STRING,
    Massage: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Massage',
  });
  return Massage;
};