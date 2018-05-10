var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('./db/logs.db', sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
    if (err) {
        return console.error(err.message);
    }
    console.log('Connected to the in-memory SQlite database.');
});

var readline = require('readline');
var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false
});

rl.on('line', function(line) {
    if (line.toLowerCase().startsWith("exit")) {
        process.exit(0);
    } else if (line.startsWith("SELECT")) {
        db.all(line, function(err, results) {
            if (err)
                console.log(err);
            else {
                var space = line.indexOf(" ");
                var word = line.slice(0, space + 1);
                console.log("Successful " + word.toLowerCase() + " to the database!");
                console.log(JSON.stringify(results, undefined, 2));
            }
        });
    } else {
        db.run(line, function(err) {
            if (err)
                console.log(err);
            else {
                var space = line.indexOf(" ");
                var word = line.slice(0, space + 1);
                console.log("Successful " + word.toLowerCase() + " to the database!");
            }
        });
    }
});



module.exports = db