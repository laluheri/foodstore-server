//import package mongoose
const mongoose = require('mongoose');

//import konfigurasi mongo dari app/config.js
const { dbHost, dbName, dbPort, dbPass, dbUser } = require('../app/config');

//connect ke mongoDB dengan konfigurasi yang telah kita import di atas

// mongoose.connect('mongodb://user_latihan:123456@localhost:27017/latihan?authSource=admin', {
//     useNewUrlParser: true,
//     useUnifiedTopology: true
// })


mongoose.connect(`mongodb://${dbUser}:${dbPass}@${dbHost}:${dbPort}/${dbName}?authSource=admin`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
});


// simpan koneksi dalam constanta db
const db = mongoose.connection;

// export db supaya bisa digunakan oleh file lain yang membutuhkan
module.exports = db;