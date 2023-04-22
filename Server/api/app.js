const session = require('express-session');
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require("cors");


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var aiRouter = require('./routes/api');


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

const corsOptions = {
  origin:'http://localhost:3000', 
  optionsSuccessStatus: 200,
  credentials: true,
}
app.use(cors(corsOptions))
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//Session
app.use(session({secret: "M5bCnMk$T&mpL9#3", key: "sid"}));


//app.use(<hi/>);
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/api', aiRouter);


// catch 404 and 403 and forward to error handler
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
