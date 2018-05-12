const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const db = require('./database');
let expressValidator = require('express-validator');

router.use(expressValidator());

router.post('/', function(req, res) {
    console.log('worked');
    let email = req.body.email;
    let first_name = req.body.first_name;
    let last_name = req.body.last_name;
    let password = req.body.password;

    req.assert('email', 'Email Field is Required!').notEmpty();
    req.assert('email', 'Email is Not Valid!').isEmail();
    req.assert('password', 'Password Field is Required').notEmpty();

    let errors = req.validationErrors();

    if (errors) {
        res.render('login', {
            errors: errors
        });
    } else {
        let info = {email: req.body.email, password: req.body.password};
        let sql = 'SELECT 1 FROM users WHERE email = \'' + req.body.email + '\' AND password = \'' + req.body.password + '\';';
        console.log(sql);
        let query = db.query(sql, function(err, result) {
            if (err) {
                console.log(err);
                res.render('login', {
                    errors: [{
                        location: 'body',
                        param: 'email',
                        msg: 'Invalid Email Password Combination!',
                        value: ''
                    }]
                });
            } else {
                if (result.length === 0) {
                    res.render('login', {
                        errors: [{
                            location: 'body',
                            param: 'email',
                            msg: 'Invalid Email Password Combination!',
                            value: ''
                        }]
                    });
                } else {
                    console.log(result);
                    res.redirect('/');
                }
            }
        });
    }    
});

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('login', { title: 'Express' });
});

module.exports = router;
