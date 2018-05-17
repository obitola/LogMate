const sqlite3 = require('sqlite3').verbose();

//Open a SQLite database file, or create it if it doesn't exist
var db = new sqlite3.Database('./sql/logmate.db', sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
    if (err) {
        return console.error(err.message);
    }
    console.log('Connected to the in-memory SQlite database.');
});

db.run('DROP TABLE groups', function(err) {
  if (err) throw err;

});

db.run('CREATE TABLE IF NOT EXISTS users (' +
    'google_id varchar(255) PRIMARY KEY,' +
    'name varchar(255) NOT NULL,' +
    'email varchar(255) NOT NULL,' +
    'UNIQUE (google_id));',
    function(err) {
        if (err) throw err;
        console.log('Created table users');
    }
);

db.run('CREATE TABLE IF NOT EXISTS groups (' +
    'group_id INTEGER PRIMARY KEY AUTOINCREMENT,' +
    'name varchar(255) NOT NULL,' +
    'description varchar(255) NOT NULL,' +
    'google_id varchar(255) NOT NULL,' +
    'UNIQUE (group_id));',
    function(err) {
      if (err) throw err;
      console.log('Created table groups');
    }
);

db.run('CREATE TABLE IF NOT EXISTS user_groups (' +
    'google_id varchar(255),' +
    'group_id varchar(255)' +
    ');',
    function(err) {
        if (err) throw err;
    }
);

/* db.run('CREATE TABLE IF NOT EXISTS logs (' +
    'log_id int PRIMARY KEY AUTOINCREMENT,' +
    'name varchar(255) NOT NULL,' +
    'email_verification varchar(255) NOT NULL,' +
    'UNIQUE (google_id));',
    function(err) {
        if (err)
            throw err;
        console.log("Created users if it didn't exist already");
    }
); */

module.exports = {
    findUserById: function(id, callback) {
        let sql = 'SELECT * FROM users WHERE google_id = \'' + id + '\';';
        db.all(sql, function(err, results) {
            if (err) throw err;
            callback(results[0]);
        })
    },

    getAdminGroups: function(user, callback) {
      let sql = 'SELECT * FROM groups WHERE google_id = \'' + user.google_id + '\';';
      db.all(sql, function(err, results) {
        if (err) throw err;
        callback(results);
      })
    },

    addUser: function(user) {
        let sql = 'INSERT INTO users(google_id, name, email) VALUES (?, ?, ?)';
        let data = [user.google_id, user.name, user.email];

        db.run(sql, data, function(err, results) {
            if (err) throw err;
        });
    },

    createGroup: function(group) {
      let sql = 'INSERT INTO groups (name, description, google_id) VALUES (?, ?, ?)';
      let data = [group.name, group.description, group.google_id]
      db.run(sql, data, function(err, results) {
        if (err) throw err;
      })
    }
}
