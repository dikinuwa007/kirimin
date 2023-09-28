const{User,Shipping,Item,ShippedItem,Shipper,Profile} = require('../models')
const {formatDate} = require('../helper')
const bcrypt=require('bcryptjs')
const {Op} = require('sequelize')
const easyinvoice = require('easyinvoice')
const http = require('http');
const fs = require('fs');
// const easyinvoice = require('easyinvoice');
class UserController{
    static landingPage(req,res){
        res.render('landingpage')
    }
    static invoice(req,res,callback){
        const easyinvoice = require('easyinvoice');
const fs = require('fs');

const invoiceData = {
  documentTitle: 'Invoice',
  currency: 'USD',
  taxNotation: 'vat', // or 'vat' for Value Added Tax
  marginTop: 25,
  marginRight: 25,
  marginLeft: 25,
  marginBottom: 25,
  logo: 'https://example.com/logo.png', // URL or base64 encoded image
  sender: {
    company: 'Your Company',
    address: '123 Main Street',
    zip: '12345',
    city: 'Your City',
    country: 'Your Country',
  },
  client: {
    company: 'Client Company',
    address: '456 Client Street',
    zip: '54321',
    city: 'Client City',
    country: 'Client Country',
  },
  invoiceNumber: 'INV-12345',
  invoiceDate: '2023-09-28',
  products: [
    {
      quantity: 2,
      description: 'Product A',
      tax: 6.25, // Tax rate in percent
      price: 10,
    },
    {
      quantity: 1,
      description: 'Product B',
      tax: 6.25,
      price: 20,
    },
  ],
  bottomNotice: 'Thank you for your business!',
};

 easyinvoice.createInvoice(invoiceData, (result) => {
      const pdfBuffer = result.pdf;

      // Set the appropriate headers for downloading the PDF
      res.setHeader('Content-Disposition', 'attachment; filename="invoice.pdf"');
      res.setHeader('Content-Type', 'application/pdf');
      
      // Send the PDF buffer as the response
      res.end(pdfBuffer);
    });
    }

    static registerForm(req,res){
        let errors = req.query.err;
        res.render('register',{errors})
    }
    static postRegister(req,res){
        const {email,username,password,role} = req.body
        User.create({email,username,password,role})
        .then(newUser=>{
            res.redirect('login')
        })
            .catch((err)=>{
            if(err.name=`SequelizeValidationError`){
                const errors = err.errors.map(el=>el.message)
                res.redirect(`/register?err=${errors}`)
            }
        })
        
    }
    static loginForm(req,res){
        const {error} = req.query
        res.render('login',{error})
    }
    static postLogin(req,res){
        const{username,password}=req.body
        User.findOne({
            where:{username}
        })
        .then(user=>{
            if(user){
                const isValid = bcrypt.compareSync(password,user.password)
                if(isValid){
                    req.session.userId = user.id
                    req.session.role=user.role
                    if(req.session.role==='superadmin'){
                        return res.redirect('/superadmin/landingpage')
                    }else if(req.session.role === 'user'){
                        User.findOne({
                            where:{username}
                        })
                        .then((data)=>{
                            Profile.findOne({
                            where:{UserId:req.session.userId}
                            })
                            .then((dataProfile)=>{
                            if(dataProfile){
                              return res.redirect(`/user/${req.session.userId}/profile`)
                            }
                            if(!dataProfile){
                              return res.redirect(`/user/${req.session.userId}/profile/add`)
                            }
                            })
                        })

                    }
                }
                else{
                    const errors=('Invalid username/password')
                    return res.redirect(`/login?error=${errors}`)
                }
            }else{//datanya tidak ada dan bukan catch error
                const errors=('Invalid username/password')
                return res.redirect(`/login?error=${errors}`)
            }
        })
        .catch(err=>{
            res.send(err)
        })
    }
    static getLogout(req,res){
        req.session.destroy((err)=>{
            if(err){
                console.log(err);
                res.send(err)
            }else{
                res.redirect('/login')
            }
        })
    }
    static userLandingPage(req,res){
        const iduser = +req.params.iduser
        res.render('userlandingpage',{iduser})
    }
    static addProfileForm(req,res){
        const iduser = +req.session.userId
        res.render('addprofile',{iduser}) 
    }
    static addProfileHandler(req,res){
        const iduser = +req.session.userId
        const {name,userAddress} = req.body
        // res.send('addProfile',{iduser})
        Profile.create({name,userAddress,UserId:iduser})
        .then(()=>{
           res.redirect(`/user/${iduser}/profile`) 
        })
        .catch((err)=>{
            res.send(err)
        })
    }
    static getProfile(req,res){
        const iduser = +req.session.userId
        Profile.findAll({
			include:{
			model:User
			},where:{UserId:iduser}
		})
        .then(dataProfile=>{
            req.session.profileId = dataProfile[0].id
            let idProfile = req.session.profileId
            // console.log('PROFILE ID',req.session.profileId);
            res.render('profile',{dataProfile,idProfile})
        })
        .catch(err=>{
            console.log(err);
            res.send(err)
        })
    }
    static postProfile(req,res){
        const id = req.session.userId
        // const iduser=req.params.iduser
        const {name,address}=req.body
        Profile.update({
            name,userAddress:address
        },{
            where :{UserId:id}
        })
        .then(()=>{
            res.redirect(`/user/${id}/profile`)
        })
    }

    static getShipping(req,res){
        // const id = req.session.userId
        const idProfile = req.session.profileId
        const status = req.query.status

        Shipping.findAll({
			include:{
			model:ShippedItem,
			include: Item
			},where:{
            ProfileId:idProfile
        //     status:{
        //         [Op.not]: true
        // }
        }
		})
        // Shipping.getShippingsByStatus(status)
		.then(data=>{
        // res.send(data)
        res.render('usershipping',{data,idProfile,formatDate})
		})
		.catch(err=>{
            console.log(err);
			res.send(err)
		})
    }
    static superadminShipperList(req,res){
        Shipper.findAll({})
        .then(data=>{
            res.render('shipperlist',{data})
        })
        .catch(err=>{
            res.send(err)
        })
    }
    static userAddShippingForm(req,res){
        const idProfile=req.session.profileId
        Shipper.findAll()
        .then(dataShipper=>{
            Item.findAll()
            .then(dataItem=>{
                res.render('addshipping',{idProfile,dataShipper,dataItem})
            })
        })
        
    }
    static userAddShippingHandler(req,res){
        const idProfile=req.session.profileId
        const{destination,dataItem,dataShipper} = req.body
        Shipping.create({destination,ShipperId:dataShipper,ProfileId:idProfile})
        .then(()=>{
            return Shipping.findOne({
                    where:{},
                    order:[['createdAt','DESC']],
                    })
            // ShippedItem.create({ItemId:dataItem})
            .then((data)=>{
            let ShippingId = data.dataValues.id
            return ShippedItem.create({ItemId:dataItem,ShippingId:ShippingId})
            })
            .then(()=>{ res.redirect(`/user/${idProfile}/shipping`)})
        })
        .catch((err)=>{res.send(err)})
    }
    static userReceive(req,res){
        const iduser=req.params.iduser
        Shipping.update({
            process:'Receive'
        },{
            where :{iduser}
        })
    }
    static superadminAddShipperForm(req,res){
        res.render('addshipper')
    }
    static superadminAddShipperHandler(req,res){
        const {name} = req.body
    }
    static superadminEditShipperForm(req,res){
        const idshipper=req.params.idshipper
        Shipper.findOne({})
    }
    static superadminEditShipperHandler(req,res){
        const idshipper=req.params.idshipper
        const {name} = req.body
        Shipper.update({
        name
        },{
            where :{idshipper}
        })
        .then(()=>{
            res.redirect('/')})
    }
    static getDelete(req,res){
        const iduser = req.session.userId
        User.destroy({
            where:{id:iduser}    
        })
        .then(()=>{
            res.redirect('/logout')
        })
    }
}
module.exports=UserController