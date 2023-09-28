'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Profile extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Profile.belongsTo(models.User,{foreignKey:'UserId'})//one to one
      Profile.hasMany(models.Shipping)//one to many
    }
  }
  Profile.init({
    username: DataTypes.STRING,
    userAddress: {
    type:DataTypes.STRING,
    allowNull:false,
    validate:{
      notNull:{
        msg:'address required'  
      },
      notEmpty:{
        msg:'address required'
      }
    }
    },
    UserId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Profile',
  });
  return Profile;
};