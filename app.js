const express = require('express');
// const Controller = require('./controllers/controllers');
const app = express();
const PORT = 3000;
const{Item,User,Shipping,Shipper,ShippedItem,Profile} = require('./models')
app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: false }));

// app.get('/', Controller.home);
// app.get('/register', Controller.register);
// app.post('/register', Controller.gCategory);
// app.get('/home', Controller.gAddMeme);
// app.get('/addShipping', Controller.renderAddShipping);
// app.post('/addShipping', Controller.handlerAddShipping);
// app.get('/updateShipping/:idshipping', Controller.renderUpdateShipping);
// app.post('/updateShipping/:idshipping', Controller.handlerUpdateShipping);

// app.get('/:id/logout', Controller.renderUpdateShipping);

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
app.listen(PORT, function (err) {
	if (err) console.log(err);
	console.log("Server listening on PORT", PORT);
});
