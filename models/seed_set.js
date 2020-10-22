'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Seed_Set extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Seed_Set.init({
    ID_Project: DataTypes.STRING,
    ID_Seed: DataTypes.STRING,
    ID_Breeding: DataTypes.STRING,
    Number_Seed: DataTypes.STRING,
    Date_Seed: DataTypes.STRING,
    ID_Gen: DataTypes.STRING,
    check: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Seed_Set',
  });
  return Seed_Set;
};