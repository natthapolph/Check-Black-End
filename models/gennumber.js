"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class GenNumber extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  GenNumber.init(
    {
      ID_Project: DataTypes.STRING,
      No: DataTypes.INTEGER,
      Year: DataTypes.STRING,
      StepBy: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "GenNumber",
    }
  );
  return GenNumber;
};
