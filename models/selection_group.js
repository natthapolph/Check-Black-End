'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Selection_Group extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Selection_Group.init({
    ID_Project: DataTypes.STRING,
    Step: DataTypes.STRING,
    ID_SproutPlanting: DataTypes.STRING,
    ID_Set: DataTypes.STRING,
    ToTalAmout: DataTypes.STRING,
    SumID: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Selection_Group',
  });
  return Selection_Group;
};