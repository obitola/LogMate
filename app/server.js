var sqlite = require("sqlite3");
var express = require("express");
var bodyParser = require("body-parser");
var app = express();

var db = require("./scripts/database.js");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(function(req, res, next) { // request, response, next
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
    res.header("Access-Control-Allow-Headers", "Content-Type, cache-control");
    return next();
});

var port = process.env.PORT || 8080; // set our port
var router = express.Router(); // get an instance of the express Router

// middleware to use for all requests ------------------------------------------
router.use(function(req, res, next) {
    // do logging
    // console.log("Server in use");
    next(); // make sure we go to the next routes and don't stop here
});

// this is an alias, so people don’t know the real file-path of your application
app.use('/api1', express.static(__dirname + '/session2/bb/'));
//they can ask for `static/critical.js` and get `app/important/critical.js`, but
//a hacker wouldn’t know the file path to actually get the file if they got mischievous

router.route("/something/arbitrary/")
    .get(function(req, res) { // GET requests respond with Hello World
        res.send("Sending Hello World!");
        //res.json({ message: 'Hello World!' }); // Turns structures into a string
        // JavaScript Object Notation
        // Can be parsed out by more than JavaScript (Python, etc)
    });

router.route("/get/")
    .get(function(req, res) { // GET requests respond with Hello World
        query = "SELECT * FROM users WHERE email = ? AND pswd = ?;"
        db.all(query, ["me", "1234"], function(err, users) {
            if (err) {
                console.log(err.message);
                res.send("Error finding specified user");
            }
            res.send(users);
        });
    });

router.route("/post/")
    .get(function(req, res) { // GET requests respond with Hello World
        db.run("INSERT INTO users(email, pswd) VALUES (?,?);", ["me", "1234"], function(err) {
            if (err) {
                console.log("User already exists...");
                res.send("User already exists...");
            } else {
                console.log("Making user...");
                res.json({ message: "Success" });
            }
            return;
        });
    });

// New from Session 2 ----------------------------------------------------------
// localhost:8080/api/ui2/
// --> localhost:8080/api/ui2/static
// localhost:8080/api/ui2
// --> localhost:8080/api/static
app.use('/static', express.static(__dirname + '/'));

// route for the second
router.route("/")
    .get(function(req, res) {
        res.sendFile(__dirname + "/views/homepage.html");
    });

router.route("/groceries/all/")
    .get(function(req, res) {
        var query = "SELECT * FROM groceries;";

        db.all(query, function(err, groceries) {
            if (err) {
                console.log(err);
                res.send("Database error, check your setup");
            } else {
                console.log("Got all the groceries");
                res.json(groceries);
            }
        });
    });

router.route("/groceries/:type?")
    .get(function(req, res) {
        var type = req.params.type;


        // Make a SQL query asking for only types that equal ?
        // ? is db.run() and db.all()'s way of making a placeholder
        // Passing in an array after the query gives a list of values to replace the '?' symbols with
        var query = "<fill in here> type = ?;"; // get every grocery item where the type is... ?

        var values = [ /*variable*/ ]; // What would we want to replace the '?' symbol above with? (It's not a trick question)

        db.all(query, values, function(err, groceries) {
            if (err) {
                console.log(err);
                res.send("Couldn't find the query, type wrong?");
            } else {
                console.log("Got the grocery list of type '" + type + "'");
                //console.log(groceries);
                res.json(groceries);
            }
        });
    })
    .post(function(req, res) {
        name = req.body.name;
        // now get variables 'price' and 'type'

        //console.log("name: " + name + " price: " + price + " type: " + type + " id: " + id);

        // This is how you specify a new entry's values -- best to specify the order you're inserting them in, like (name, id, type, price)
        var query = "<fill in here> VALUES (?,?,?);" // Insert a new groceries row item (including its name, price, and type) with the values specified. The '?'s will be replaced by the values

        var values = [ /* insert, variables, here */ ]; // List variables to replace the '?' symbols in queryas a comma, separated, list, here, in order

        db.run(query, values, function(err) {
            if (err) {
                console.log(err);
                res.send("Invalid POST");
            } else {
                console.log("Making user...");
                res.json({ message: "Grocery added" });
            }
        });
    })
    .put(function(req, res) {
        name = req.body.name;
        // now get variables 'price' 'type', and 'id'

        //console.log("name: " + name + " price: " + price + " type: " + type + " id: " + id);

        var query = "<fill in here> SET x = ?, y = ?, z = ? WHERE id = ?;" // This is how you update a new entry's values, selecting by its id

        var values = [ /* insert, variables, here */ ]; // List variables to replace the '?' symbols in queryas a comma, separated, list, here, in order

        db.run(query, values, function(err) {
            if (err) {
                console.log(err);
                res.send("Invalid PUT");
            } else {
                console.log("Updating user...");
                res.json({ "message": "Grocery updated" });
            }
        });
    })
    .delete(function(req, res) {
        id = req.body.id;

        //console.log("id: " + id);

        var query = "" // Delete the element whose id matches the one we just pulled in from req.body

        var values = [ /* insert, variables, here */ ] // List variables to replace the '?' symbols in query as a comma, separated, list, here, in order

        db.run(query, values, function(err) {
            if (err) {
                console.log(err.message);
                res.send("Invalid DELETE");
            } else {
                res.send({ message: "Grocery deleted" });
                return;
            }
        });
    });

// -----------------------------------------------------------------------------
//add-on to the IP address and port #, for minor security and/or personal flair
app.use("/", router);

//Tell the application to listen on the port # you specified above
server = app.listen(port);
console.log("Express server listening on port %d in %s mode. ", port, app.settings.env);