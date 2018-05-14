const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/user');
const dashboardRouter = require('./routes/dashboard');
const authRouter = require('./routes/auth');
const cookieSession = require('cookie-session');
const mongoose = require('mongoose');
const keys = require('./routes/keys')
const passport = require('passport');
let expressValidator = require('express-validator');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(expressValidator());
app.use(cookieParser());
app.use(cookieSession({
  maxAge: 24 * 60 * 60 * 1000,
  keys: [keys.cookieKey]
}));

app.use(passport.initialize());
app.use(passport.session());

mongoose.connect(keys.mongodb.dbURI, () => {
  console.log('Connected to MongoDB');
}).catch(function() {
  console.log('Cannot Connect to MongoDB');
})

app.use(express.static(path.join(__dirname, 'public')));
app.use('/', indexRouter);
app.use('/dashboard', dashboardRouter);
app.use(authRouter);

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
