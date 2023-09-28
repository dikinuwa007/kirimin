'use strict';
const {
  Model
} = require('sequelize');
const bcrypt = require('bcryptjs')
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasOne(models.Profile)//konsep one to one with profile
    }
  }
  User.init({
    username: {
    type:DataTypes.STRING,
    allowNull:false,
    validate:{
      notNull:{
        msg:'user name required'  
      },
      notEmpty:{
        msg:'user name required'
      }
    }
    },
    password: {
    type:DataTypes.STRING,
    allowNull:false,
    validate:{
      notNull:{
        msg:'password name required'  
      },
      notEmpty:{
        msg:'password name required'
      }
    }
    },
    role: DataTypes.STRING,
    email: {
    type:DataTypes.STRING,
    allowNull:false,
    validate:{
      notNull:{
        msg:'email required'  
      },
      notEmpty:{
        msg:'email required'
      }
    }
    }
  }, {
    hooks:{
      beforeCreate(user,option){
        let salt = bcrypt.genSaltSync(8);//rounds semakin besar semakin secure,tapi memory semakin berat
        let hash = bcrypt.hashSync(user.password,salt);
        user.password = hash
      }
    },
    sequelize,
    modelName: 'User',
  });
  return User;
};