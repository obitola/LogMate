const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const db = require('./database');
const passport = require('passport');

router.use(passport.initialize());
router.use(passport.session());

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
router.get('/create-group', function(req, res, next) {
    res.render('create-group', { title: 'Express' });
});

router.post('/create-group', function(req, res, next) {
  let name = req.body.name;
  let description = req.body.name;

  req.assert('name', 'Name is Required').notEmpty();
  req.assert('description', 'Description is required').notEmpty();

  let errors = req.validationErrors();
  let group = {
    name: name,
    description: description,
    google_id: req.user.google_id
  }

  if (errors) {
    res.render('create-group', {
            errors: errors
    });
  } else {
    db.createGroup(group);
    res.redirect('./../dashboard');
  }
})

module.exports = router;
