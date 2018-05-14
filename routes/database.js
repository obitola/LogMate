const sqlite3 = require('sqlite3').verbose();
const mysql = require('mysql');

//Open a SQLite database file, or create it if it doesn't exist
var db = new sqlite3.Database('./sql/logmate.db', sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
    if (err) {
        return console.error(err.message);
    }
    console.log('Connected to the in-memory SQlite database.');
});

/* db.run('DROP TABLE users',
    function(err) {
        if (err)
            throw err;
        console.log("Created users if it didn't exist already");
    }
); */

db.run('CREATE TABLE IF NOT EXISTS users (' +
    'google_id varchar(255) PRIMARY KEY,' +
    'name varchar(255) NOT NULL,' +
    'email varchar(255) NOT NULL,' +
    'UNIQUE (google_id));',
    function(err) {
        if (err)
            throw err;
        console.log("Created users if it didn't exist already");
    }
);

module.exports = {
    findUserById: function(id, callback) {
        let sql = 'SELECT * FROM users WHERE google_id = \'' + id + '\';';
        db.all(sql, function(err, results) {
            if (err) throw err;
            callback(results[0]);
        })
    },
    
    addUser: function(user) {
        let sql = 'INSERT INTO users(google_id, name, email) VALUES (?, ?, ?)';
        function query(sql, data, callback) {
            db.all(sql, data, function(err, results) {
                if (err) throw err;
                callback(results);
            })
        }
    
        data = [user.google_id, user.name, user.email];
    
        let results = [];
        query(sql, data, function(res) {
            results = res;
        })
        if (results.length === 0) {
            return undefined;
        } else {
            return results[0];
        }
    }
}