var express = require('express');
var router = express.Router();
var mysql = require('mysql');

var db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: 'logmate'
});

db.connect(function(err) {
   if (err) throw err;
   console.log('MySql Connected...');
});

router.post('/newuser', function(req, res) {
    console.log('worked');
    let email = req.body.email;
    let first_name = req.body.first_name;
    let last_name = req.body.last_name;
    let password = req.body.password;

    req.checkbody('email', 'Email Field is Required!').notEmpty();
    req.checkbody('email', 'Email is Not Valid!').isEmail();
    req.checkbody('first_name', 'First Name Field is Required').notEmpty();
    req.checkbody('last_name', 'Last Name Field is Required').notEmpty();
    req.checkbody('password', 'First Name Field is Required').notEmpty();
    req.checkbody('password2', 'Passwords Do Not Match!').equals(req.body.password);

    let errors = req.validationErrors();

    if (errors) {
        console.log(errors);
    } else {
        let info = {email: 'oluwatobi.ola@gmail.com', first_name: 'Tobi', last_name: 'Ola', password: 'qwerty'};
        let sql = 'INSERT INTO users SET ?';
        let query = db.query(sql, info, function(err, result) {
            if (err) throw err;
            console.log(result);
            res.send()
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
