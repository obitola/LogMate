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
    req.assert('first_name', 'First Name Field is Required').notEmpty();
    req.assert('last_name', 'Last Name Field is Required').notEmpty();
    req.assert('password', 'First Name Field is Required').notEmpty();
    req.assert('password2', 'Passwords Do Not Match!').equals(req.body.password);

    let errors = req.validationErrors();

    if (errors) {
        res.render('register', {
            errors: errors
        });
    } else {

        let info = {email: req.body.email, first_name: req.body.first_name, last_name: req.body.last_name, password: req.body.password};
        let sql = 'INSERT INTO users SET ?';
        let query = db.query(sql, info, function(err, result) {
            if (err) {
                res.render('register', {
                    errors: [{
                        location: 'body',
                        param: 'email',
                        msg: 'This Email Has Already Been Used!',
                        value: ''
                    }]
                });
            } else {
                console.log(result);
                res.redirect('/');
            }
        });
    }    
});

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('login', { title: 'Express' });
});

module.exports = router;
