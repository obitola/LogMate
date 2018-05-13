const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const db = require('./database');

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('dashboard', { title: 'Express' });
});

module.exports = router;
