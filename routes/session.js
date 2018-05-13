var session = require('express-session')
var express = require('express')
var router = express.Router();

router.use(session( {
    secret: 'qwerty',
    resave: true,
    saveUninitialized: true
}));

router.use(function (req, res, next) {
  req.session.nowInMinutes = Math.floor(Date.now() / 60e3)
  next()
});

module.exports = session;