const sqlite3 = require('sqlite3').verbose();
const mysql = require('mysql');

//Open a SQLite database file, or create it if it doesn't exist
var db = new sqlite3.Database('./sql/logmate.db', sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
    if (err) {
        return console.error(err.message);
    }
    console.log('Connected to the in-memory SQlite database.');
});

db.run('CREATE TABLE IF NOT EXISTS users (' +
    'user_id INTEGER PRIMARY KEY AUTOINCREMENT,' +
    'email varchar(255) NOT NULL,' +
    'first_name varchar(255) NOT NULL,' +
    'last_name varchar(255) NOT NULL,' +
    'password VARCHAR(255),' +
    'UNIQUE (email));',
    function(err) {
        if (err)
            throw err;
        console.log("Created users if it didn't exist already");
    });

module.exports = db;