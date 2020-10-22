'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Selection extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Selection.init({
    ID_Project: DataTypes.STRING,
    Step: DataTypes.STRING,
    ID_SproutPlanting: DataTypes.STRING,
    ID_Main: DataTypes.STRING,
    Date: DataTypes.STRING,
    Amount: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Selection',
  });
  return Selection;
};