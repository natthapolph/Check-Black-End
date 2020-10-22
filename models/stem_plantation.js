'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Stem_Plantation extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Stem_Plantation.init({
    ID_Project: DataTypes.STRING,
    ID_Stem: DataTypes.STRING,
    Step: DataTypes.STRING,
    ID_Previous: DataTypes.STRING,
    ID_SproutPlanting: DataTypes.STRING,
    Date: DataTypes.STRING,
    ID_Farm: DataTypes.STRING,
    FarmName: DataTypes.STRING,
    ID_Block: DataTypes.STRING,
    ID_Unit: DataTypes.STRING,
    ID_Rep: DataTypes.STRING,
    Count: DataTypes.STRING,
    ID_Set: DataTypes.STRING,
    numSelec: DataTypes.STRING,
    dateSelec: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Stem_Plantation',
  });
  return Stem_Plantation;
};