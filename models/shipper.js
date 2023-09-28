'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Shipper extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Shipper.init({
    name: {
    type:DataTypes.STRING,
    allowNull:false,
    validate:{
      notNull:{
        msg:'shipper name required'  
      },
      notEmpty:{
        msg:'shipper required'
      }
    }
    }
  }, {
    sequelize,
    modelName: 'Shipper',
  });
  return Shipper;
};