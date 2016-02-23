
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

// Database
var mongoose = require('mongoose');
var passport = require('passport');
var expressSession = require('express-session');
var config = require('./config');

// Routes
var restrict = require('./auth/restrict');
var login = require('./routes/login');
var register = require('./routes/register');
var homepage = require('./routes/homepage');
var workout = require('./routes/workout');
var cardio = require('./routes/cardio');
var weight = require('./routes/weight');

const MongoStore = require('connect-mongo')(expressSession);
var passportConfig = require('./auth/passport-config');
passportConfig();

mongoose.connect(config.mongoUri);
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(expressSession(
    {
      secret: 'getting good workout',
      saveUninitialized: false,
      resave: false,
      store: new MongoStore({
        mongooseConnection: mongoose.connection
      })
    }
));


app.use(passport.initialize());
app.use(passport.session());

app.use('/', login);
app.use('/', register);
app.use(restrict);
app.use('/', homepage);
app.use('/', workout);
app.use('/', cardio);
app.use('/', weight);

app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {

    res.status(err.status || 500);
    next(err);
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  next(err);
});


module.exports = app;
