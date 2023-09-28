npm ini -y
npm install sequelize express pg ejs bcryptjs
npm i express-session
npm i -D sequelize-cli
npm sequelize init

npm sequelize db:create

Menggunakan konsep double one to many

//sebelum ke routing ada sesuatu, sesuatu itulah yang disebut middleware

pemakaian session di cognito tidak bisa digunakan karena di incognito tidak 
//jejaknya ada di browser dan di cookie
//express session tersimpan di browser client
//gak akan bentrok jika login karena disinpan di memory store server. session itu ada waktu
//jika di restart servernya maka cachenya hilang
//destroy untuk menghapus semua session