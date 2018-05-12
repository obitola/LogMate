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

        let info = {email: email, first_name: first_name, last_name: last_name, password: password};
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
                res.redirect('/');
            }
        });
    }    
});

router.get('/restarttable', function(req, res) {
    
    let sql = 'DROP TABLE users; CREATE TABLE users(user_id int AUTO_INCREMENT, email VARCHAR(255), first_name VARCHAR(255), last_name VARCHAR(255), password VARCHAR(255), PRIMARY KEY user_id, UNIQUE(email));';

    db.query(sql, function(err, result) {
        if (err) throw err;
        console.log(result);
        res.send('Table created...');
    });
});

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('register', { title: 'Express' });
});

module.exports = router;
