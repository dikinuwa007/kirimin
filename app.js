const express = require('express');
// const Controller = require('./controllers/controllers');
const app = express();
const PORT = 3000;
const{Item,User,Shipping,Shipper,ShippedItem,Profile} = require('./models');
const session = require('express-session')
const UserController = require('./controllers/UserController');
app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: false }));

//tegantung peletakkan middleware
const isLoggedIn=function(req,res,next){
	// console.log('CONTOH MIDDLEWARE GLOBAL');
	if(!req.session.userId){
		const errors = 'please login first'
		res.redirect(`/login?error=${errors}`)
	}else{
	next()
	}
}
const isSuperAdmin=function(req,res,next){
	if(req.session.userId && req.session.role !== 'superadmin'){
		const errors = 'you have no access'
		res.redirect(`/login?error=${errors}`)
	}else{
	next()
	}
}
app.get('/',UserController.landingPage)


// app.use(function(req,res,next){
// 	// console.log('CONTOH MIDDLEWARE GLOBAL');
// 	if(req.session.userId && req.session.role !== 'superadmin'){
// 		const errors = 'you have no access'
// 		res.redirect(`/login?error=${errors}`)
// 	}else{
// 	next()
// 	}
// })

const middleWare= function(req,res,next){
	next()
}
app.use(session({
secret:'rehasia',
resave:false,
saveUninitialized:false,
cookie:{
	secure:false,
	sameSite:true//security csrf attack
	//https	
}
}))

app.get('/register',UserController.registerForm)
app.post('/register',UserController.postRegister)
app.get('/login',UserController.loginForm)
app.post('/login',UserController.postLogin)

app.get('/user/:iduser/landingpage',UserController.userLandingPage)

app.get('/user/:iduser/profile',isLoggedIn,UserController.getProfile)
//jika profilenya gak ada
app.get('/user/:iduser/profile/add',isLoggedIn,UserController.addProfileForm)
app.post('/user/:iduser/profile/add',isLoggedIn,UserController.addProfileHandler)

app.post('/user/:iduser/profile',isLoggedIn,UserController.postProfile)

app.get('/user/:iduser/shipping',isLoggedIn,UserController.getShipping)

app.get('/user/:iduser/delete',isLoggedIn,UserController.getDelete)

app.get('/user/:iduser/shipping',UserController.getShipping)
app.get('/user/:iduser/shipping/add',UserController.userAddShippingForm)
app.post('/user/:iduser/shipping/add',UserController.userAddShippingHandler)
app.get('/user/:iduser/shipping/receive',UserController.userReceive)
// app.get('/shipping/:iduser', isLoggedIn,Controller.renderUserShipping); //dia ke isLoggedIn ,isSuperAdmin baru ke render jika sudah bener
// app.get('/shipping/:id', UserController.getShipping);
app.get('/superadmin/shipper/list', UserController.superadminShipperList);
app.get('/superadmin/shipper/add', UserController.superadminAddShipperForm);
app.get('/superadmin/shipper/:idshipper/edit', UserController.superadminEditShipperForm);
// app.post('/addShipping', Controller.handlerAddShipping);
// app.get('/updateShipping/:idshipping', Controller.renderUpdateShipping);
// app.post('/updateShipping/:idshipping', Controller.handlerUpdateShipping);

app.get('/logout', UserController.getLogout);

// app.get('/ships',(req,res)=>{
// 		Shipping.findAll({
// 			include:{
// 			model:Item
// 			}
// 		})
// 		.then(data=>{
// 			res.send(data)
// 		})
// 		.catch(err=>{
// 			res.send(err)
// 		})
// 	}) manytomany
app.get('/ships',(req,res)=>{
		Shipping.findAll({
			include:{
			model:ShippedItem,
			include: Item
			}
		})
		.then(data=>{
			res.send(data)
		})
		.catch(err=>{
			res.send(err)
		})
	}) 

//middleware agar bisa digunakan di satu routing , Kalo global 

// app.use(function(req,res,next){
// 	console.log('CONTOH MIDDLEWARE GLOBAL');
// 	next()
// })

app.listen(PORT, function (err) {
	if (err) console.log(err);
	console.log("Server listening on PORT", PORT);
});
