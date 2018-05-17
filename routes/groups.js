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

router.get('/manage-groups', function(req, res, next) {
  console.log(req.user);
  db.getAdminGroups(req.user, function(results) {
    console.log(results);
    let groups = results;
    let rows = [];
    for (let i = 0; i < results.length; i++) {
      if (i % 3 === 0) {
        rows.push([results[i]])
      } else {
        rows[rows.length - 1].push(results[i]);
      }
    };
    if (results.length === 0) {
      results = null;
    }
    console.log(rows)
    res.render('manage-groups', {
      rows: rows
    });
  });
});




/* GET home page. */
router.get('/create-group', function(req, res, next) {
    res.render('create-group', { title: 'Express' });
});

router.post('/create-group', function(req, res, next) {
  let name = req.body.name;
  let description = req.body.description;

  req.assert('name', 'Name is Required').notEmpty();
  req.assert('description', 'Description is required').notEmpty();

  let errors = req.validationErrors();
  if (description.length > 255) {
    errors.push({
      msg: "Description is too long"
    })
  }

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
});

router.get('/join-group/:id', function(req, res, next) {
  db.findGroupByID(req.params.id, function(group) {
    if (group === undefined) {
      res.redirect('./../error');
    }



  })
});

module.exports = router;
