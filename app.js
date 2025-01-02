// Required modules
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var hbs = require('hbs');
var mongoose = require('mongoose');
var dotenv = require('dotenv').config();


// Routes
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var loginRouter = require('./routes/login');

var app = express();

// View engine setup

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs'); // Set the view engine to HTML

// Middleware setup
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


  //connecting database

mongoose.connect(process.env.mongodburl)
.then((connect)=>{ 
  console.log("connected to database");
})
.catch((err)=>{
  console.log(err);
})


// Routes setup
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/login', loginRouter);

// Catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// Error handler
app.use(function(err, req, res, next) {
  // Set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // Render the error page
  console.log(err);
  res.status(err.status || 500);
  res.render('error'); // Renders views/error.html
});

module.exports = app;
