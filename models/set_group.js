'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Set_Group extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Set_Group.init({
    ID_Project: DataTypes.STRING,
    Step: DataTypes.STRING,
    ID_Stem: DataTypes.STRING,
    ID_SproutPlanting: DataTypes.STRING,
    ID_Set: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Set_Group',
  });
  return Set_Group;
};