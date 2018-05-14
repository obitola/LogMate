const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const db = require('./database');
const passport = require('passport');


router.all('/', function(req, res, next) {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.redirect('/');
  }
});


/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('dashboard', { title: 'Express' });
});

module.exports = router;
