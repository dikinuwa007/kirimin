const{User,Shipping,Item,ShippedItem,Shipper,Profile} = require('../models')
const bcrypt=require('bcryptjs')
class UserController{
    static landingPage(req,res){
        res.render('landingpage')
    }
    static registerForm(req,res){
        res.render('register')
    }
    static postRegister(req,res){
        const {email,username,password,role} = req.body
        User.create({email,username,password,role})
        .then(newUser=>{
            res.redirect('login')
        })
        .catch(err=>{
            res.send(err)
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
                    }else if(req.session.role==='user'){
                        return res.redirect(`/user/${req.session.userId = user.id}/landingpage`)
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
    static getProfile(req,res){
        const iduser = +req.session.userId
        Profile.findAll({
			include:{
			model:User
			},where:{UserId:iduser}
		})
        .then(dataProfile=>{
            console.log(dataProfile);
            //  res.send(dataProfile)
            res.render('profile',{dataProfile})
        })
        .catch(err=>{
            console.log(err);
            res.send(err)
        })
    }
    static postProfile(req,res){
        const iduser=req.params.iduser
        Profile.findOne({
            where:{username}
        })
        .then(dataProfile=>{
            res.render('profile',dataProfile)
        })
    }

    static getShipping(req,res){
    // /user/:iduser/shipping
        // const id = req.params.id
        const id = req.params.iduser
        Shipping.findAll({
			include:{
			model:ShippedItem,
			include: Item
			},where:{ProfileId:id}
		})
		.then(data=>{
            res.render('usershipping',{data})
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
        const iduser=req.params.iduser
        res.render('addshipping',iduser)
    }
    static userAddShippingHandler(req,res){
        const iduser=req.params.iduser
        const{destination} = req.body
        Shipping.create({destination,ProfileId:iduser})
        .then(()=>{
            res.redirect(`/user/${iduser}/shipping`)
        })
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
}
module.exports=UserController