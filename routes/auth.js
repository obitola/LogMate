var express = require('express');
var router = express.Router();

var passport = require('passport');

passport.serializeUser(function(user, done) {
    done(null, user);
  });
  
  passport.deserializeUser(function(user, done) {
    done(null, user);
  });

router.use(passport.initialize());
router.use(passport.session());

var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

var db = require('./database');

var auth =  {
    'clientID': '980332939080-f23k9o4v0uj2stuhcbkeln193lnncvvp.apps.googleusercontent.com',
    'clientSecret': 'PLPunJxNYOxWD_uJ_CH6CpqD',
    'callbackURL': 'http://localhost:3000/auth/google/callback'

};

passport.use(new GoogleStrategy({
    clientID: auth.clientID,
    clientSecret: auth.clientSecret,
    callbackURL: auth.callbackURL
  },
  function(accessToken, refreshToken, profile, cb) {
    process.nextTick(function() {
        let sql = 'SELECT * FROM users WHERE user_id = \'' + profile.id + '\';';
        let user = [profile.id, accessToken, profile.displayName, profile.emails[0].value];
        let query = db.all(sql, function(err, result) {
            if (err) {
                throw err;
            } else if (result.length === 0) {
                let user = [profile.id, accessToken, profile.displayName, profile.emails[0].value];
                let sql = 'INSERT INTO users(user_id, token, name, email) VALUES (?, ?, ?, ?)';
                let query = db.all(sql, user, function(err, result) {
                    console.log(result);
                    if (err) {
                        console.log(err);
                        return cb(err);
                        //res.redirect('login');
                    } else {
                        return cb(null, user);
                        //res.redirect('login');
                    }
                });
            } else {
                return cb(null, user);
            }
        });
    });
  }
));

/* GET home page. */
router.get('/auth/google', passport.authenticate('google', {
    scope: ['profile', 'email']
}));

router.get('/auth/google/callback',
    passport.authenticate('google', { 
        successRedirect: '/dashboard',
        failureRedirect: '/'
    }));



    module.exports = router;


