const express = require('express');
const router = express.Router();
const mysql = require('mysql');
const bodyParser = require('body-parser');
let expressValidator = require('express-validator');

router.use(expressValidator());

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: 'logmate'
});

db.connect(function(err) {
   if (err) throw err;
   console.log('MySql Connected...');
});

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
            if (err) throw err;
            res.render('dashboard');
        });
    }    
});

router.get('/createuserstable', function(req, res) {
    let sql = 'CREATE TABLE users(user_id int AUTO_INCREMENT, email VARCHAR(255), first_name VARCHAR(255), last_name VARCHAR(255), password VARCHAR(255), PRIMARY KEY user_id)';
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
