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
    req.assert('password', 'Password Field is Required').notEmpty();

    let errors = req.validationErrors();

    if (errors) {
        res.render('login', {
            errors: errors
        });
    } else {
        let sql = 'SELECT * FROM users WHERE email = \'' + email + '\';';
        let query = db.all(sql, function(err, result) {
            if (err) {
                throw err;
            } else {
                if (result.length === 0 ) {
                    res.render('login', {
                        errors: [{
                            location: 'body',
                            param: 'email',
                            msg: 'This Email Has Not Been Registered',
                            value: ''
                        }]
                    });
                } else if (result[0].password === password) {
                    res.redirect('/');
                } else {
                    res.render('login', {
                        errors: [{
                            location: 'body',
                            param: 'email',
                            msg: 'Incorrect Password',
                            value: ''
                        }]
                    });
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
