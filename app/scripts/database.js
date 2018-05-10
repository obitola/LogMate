var sqlite3 = require('sqlite3').verbose(); // makes long stack traces

//Open a SQLite database file, or create it if it doesn't exist
var db = new sqlite3.Database('./db/logs.db', sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
    if (err) {
        return console.error(err.message);
    }
    console.log('Connected to the in-memory SQlite database.');
});

// Create a table users with columns for id, email, and a pswd
db.run("CREATE TABLE IF NOT EXISTS users(" +
    "id INTEGER PRIMARY KEY AUTOINCREMENT," +
    "email varchar(50) NOT NULL," +
    "pswd varchar(50) NOT NULL," +
    "UNIQUE (email));",
    function(err) {
        if (err)
            throw err;
        console.log("Created users if it didn't exist already")
    });

db.run("CREATE TABLE IF NOT EXISTS groceries(" +
    "id INTEGER PRIMARY KEY AUTOINCREMENT," +
    "name varchar(50) NOT NULL," +
    "price varchar(50) NOT NULL," +
    "type varchar(50) NOT NULL);",
    function(err) {
        if (err)
            throw err;
        console.log("Created groceries list if it didn't exist already")
    });

var query = "INSERT INTO groceries(name, price) VALUES (\"Ian\", \"$20.45\");"

/*
setTimeout(function() {
    db.all("SELECT * FROM groceries WHERE type = ?;", "Bean", function(err, users) {
        if (err)
            throw err;

        console.log(users)
    });
}, 200);
*/

// This exports db to a file that calls require() on this one
module.exports = db