'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Item extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      // Item.belongsToMany(models.Shipping,{through:"ShippedItems",foreignKey:'ItemId'})//konsep many to many
      Item.hasMany(models.ShippedItem,{
        foreignKey:'ItemId'
      })//kosep double one to many
    }
  }
  Item.init({
    name: DataTypes.STRING,
    price: DataTypes.INTEGER,
    description: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Item',
  });
  return Item;
};