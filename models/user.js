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
    unique:true,
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
    unique:true,
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
    sequelize,validate:{
      lengthPassword(){
        if(this.password.length<8){
            throw new Error(`password must be 8 or greater`)
        }
        if(this.education==='S3'){
          if(this.position==='Staff'){
            throw new Error(`${this.education} hanya tersedia posisi Manager dan CEO`)
          }
          else if( this.position==='Supervisor'){
            throw new Error(`${this.education} hanya tersedia posisi Manager dan CEO`)
          }
        }      
      }
    },
    modelName: 'User',
  });
  return User;
};