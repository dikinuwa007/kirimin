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
    get formattedRupiah(){
    return new Intl.NumberFormat("id-ID",{
        style:'currency',
        currency:"IDR"
    }).format(this.price)
    }
    static associate(models) {
      // define association here
      Item.belongsToMany(models.Shipping,{through:"ShippedItems",foreignKey:'ItemId'})//konsep many to many
      // Item.hasMany(models.ShippedItem,{
      //   foreignKey:'ItemId'
      // })//kosep double one to many
    }
  }
  Item.init({
    name: {
    type:DataTypes.STRING,
    allowNull:false,
    validate:{
      notNull:{
        msg:'item name required'  
      },
      notEmpty:{
        msg:'item name required'
      }
    }
    },
    price: DataTypes.INTEGER,
    description: {
    type:DataTypes.STRING,
    allowNull:false,
    validate:{
      notNull:{
        msg:'description required'  
      },
      notEmpty:{
        msg:'description required'
      }
    }
    }
  }, {
    sequelize,
    modelName: 'Item',
  });
  return Item;
};