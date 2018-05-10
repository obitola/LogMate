var createError = require('http-errors');
var express = require('express');
var path = require('path');

//var indexRouter = require('./public/routes/index');
//var usersRouter = require('./public/routes/users');

var app = express();



// view engine setup
app.set('views', path.join(__dirname, 'public'));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));


router.get('/', function(req, res, next) {
  res.render('index', { title: 'LogMate' });
});

router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

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







app.listen(3000, () => console.log('Example app listening on port 3000!'))

module.exports = app;
