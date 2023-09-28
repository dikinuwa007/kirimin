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
    get statusReceive(){
    if(this.status===false){
      return `Not Receive`
    }
    if(this.status===true){
      return `Receive`
    }
    }
    static associate(models) {
      // define association hereip
      Shipping.belongsToMany(models.Item,{through:"ShippedItems",foreignKey:'ShpingId'})//konsep many to many
      Shipping.hasMany(models.ShippedItem,{
        foreignKey:'ShippingId'
      })//konsep doubel to many
      Shipping.belongsTo(models.Profile)
    }
    static getShippingsByStatus(status){
      const option={
      
      }
      return Shipping.findAll({
			include:{
			model:ShippedItem,
			include: Item
			},where:{
            ProfileId:idProfile,
            status:{
                [Op.not]: status
        }
        }
		})
    }
// static getEmployeesByPosition(position){
//       const option={
//         where:{},
//         order:[
//           ['createdAt','DESC']
//         ]
//       }
//       if(position){
//         option.where.position={
//           [Op.iLike]:`%${position}%`
//         }
//       }
//       return Employee.findAll(option)
//     }
  }
  Shipping.init({
    destination: {
    type:DataTypes.STRING,
    allowNull:false,
    validate:{
      notNull:{
        msg:'destination required'  
      },
      notEmpty:{
        msg:'destination required'
      }
    }
    },
    estArrival: DataTypes.DATE,
    ShipperId: DataTypes.INTEGER,
    ProfileId: DataTypes.INTEGER,
    status:DataTypes.BOOLEAN
  }, {
  hooks:{
      beforeCreate:(shipping,options)=>{
        shipping.estArrival = new Date(new Date().getTime()+(2*24*60*60*1000)) //2 days
        shipping.status = false
      }
    },
    sequelize,
    modelName: 'Shipping',
  });
  return Shipping;
};