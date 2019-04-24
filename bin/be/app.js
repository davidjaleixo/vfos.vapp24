/* made by KBZ david.aleixo@knowledgebiz.pt */

var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
const recursiveReadSync = require('recursive-readdir-sync')
const contains = require("string-contains")
const expressValidator = require('express-validator');
var passport = require('passport');

//express app
var app = express();

//middleware configuration
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(cookieParser());
app.use(expressValidator());

//authentication
require('./passport');
app.use(passport.initialize());

//set Angular static files
app.use(express.static(path.join(path.normalize(__dirname), '../../views/app24/dist/app24')));

//Serve Angular app - let the Angular decide every what to do with every route by using '*'
app.get('*', function(req,res){
	res.sendFile('index.html');
})

//set API routes
app.use('/api',require('./router'));


/**
 * avoid cors 
 */
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// catch 404 and forward to error handler
// app.use(function (req, res, next) {
//   var err = new Error('Not Found');
//   err.status = 404;
//   next(err);
// });

// error handler
// app.use(function (err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};

//   // render the error page
//   res.status(err.status || 500);
//   res.render('error');
// });

module.exports = app;