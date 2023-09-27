'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Shipping extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association hereip
      // Shipping.belongsToMany(models.Item,{through:"ShippedItems",foreignKey:'ShpingId'})//konsep many to many
      Shipping.hasMany(models.ShippedItem,{
        foreignKey:'ShippingId'
      })//konsep doubel to many
      Shipping.belongsTo(models.Profile)
    }
  }
  Shipping.init({
    destination: DataTypes.STRING,
    estArrival: DataTypes.DATE,
    ShipperId: DataTypes.INTEGER,
    ProfileId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Shipping',
  });
  return Shipping;
};