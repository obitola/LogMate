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

router.get('/managegroups', function(req, res, next) {

});




/* GET home page. */
router.get('/newgroup', function(req, res, next) {
    res.render('create-group', { title: 'Express' });
});

module.exports = router;