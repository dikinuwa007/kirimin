'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ShippedItem extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  ShippedItem.init({
    itemId: DataTypes.INTEGER,
    ShippingId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'ShippedItem',
  });
  return ShippedItem;
};