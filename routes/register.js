const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const db = require('./database');
const expressValidator = require('express-validator');
const crypto = require('crypto');
const secret = 'qwerty';

const hash = (input) => {
    return crypto.createHmac('sha256', secret).update(input).digest('hex');
};

router.use(expressValidator());

router.post('/', function(req, res) {
    let email = req.body.email;
    let first_name = req.body.first_name;
    let last_name = req.body.last_name;
    let password = hash(req.body.password);

    req.assert('email', 'Email Field is Required!').notEmpty();
    req.assert('email', 'Email is Not Valid!').isEmail();
    req.assert('first_name', 'First Name Field is Required').notEmpty();
    req.assert('last_name', 'Last Name Field is Required').notEmpty();
    req.assert('password', 'Password Field is Required').notEmpty();
    req.assert('password2', 'Passwords Do Not Match!').equals(req.body.password);

    let errors = req.validationErrors();

    if (errors) {
        res.render('register', {
            errors: errors
        });
    } else {
        let info = [email, first_name, last_name, password];
        let sql = 'INSERT INTO users(email, first_name, last_name, password) VALUES (?, ?, ?, ?)';
        let query = db.all(sql, info, function(err, result) {
            console.log(result);
            if (err) {
                console.log(err);
                res.render('register', {
                    errors: [{
                        location: 'body',
                        param: 'email',
                        msg: 'This Email Has Already Been Used!',
                        value: ''
                    }]
                });
            } else {
                res.redirect('/');
            }
        });
    }    
});

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('register', { title: 'Express' });
});

module.exports = router;
