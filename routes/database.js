const mysql = require('mysql');

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

module.exports = db;