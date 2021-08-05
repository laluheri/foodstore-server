var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

// ######## IMPORT CORS ############## //
const cors = require('cors');

//##### IMPORT PRODUCT ROUTER #####
const productRouter = require('./app/product/router');
const categoryRouter = require('./app/category/router');
const tagRouter = require('./app/tag/router');
const authRouter = require('./app/auth/router');
const wilayahRouter = require('./app/wilayah/router');
//Midleware Decode TOken
const { decodeToken } = require('./app/auth/midleware');


const deleveryRouter = require('./app/delevery-address/router');
const cartRouter = require('./app/cart/router');
const orderRouter = require('./app/order/router');
const invoiceRouter = require('./app/invoice/router');
// var indexRouter = require('./routes/index');
// var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


// --------CORS -----------//
app.use(cors());

//-----MENGGUNAKAN MIDLEWARE-------------//
app.use(decodeToken());

//##### GUNAKAN PRODUCT ROUTER #####
app.use('/api', productRouter);
app.use('/api', categoryRouter);
app.use('/api', tagRouter);
app.use('/api', wilayahRouter);
app.use('/auth', authRouter);
app.use('/api', deleveryRouter);
app.use('/api', cartRouter);
app.use('/api', orderRouter);
app.use('/api', invoiceRouter);



// app.use('/', indexRouter);
// app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;