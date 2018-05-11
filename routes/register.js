var express = require('express');
var router = express.Router();
var mysql = require('mysql');

var db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "123456",
    socketPath: '/var/run/mysqld/mysqld.sock'
});

//db.connect(function(err) {
//    if (err) throw err;
//    console.log('MySql Connected...');
//});

/* router.get('/createdb', function(req, res) {
    let sql = 'CREATE DATABASE logmate';
    db.query(sql, function(err, result) {
        if (err) throw err;
        console.log(result);
        res.send('Database created...');
    });
}); */

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('register', { title: 'Express' });
});

router.post('/', function(req, res, next) {
    
});

module.exports = router;
