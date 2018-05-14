var express = require('express');
var router = express.Router();
var passport = require('passport');
var db = require('./database');
var User = require('./user')
var keys = require('./keys');

router.use(passport.initialize());
router.use(passport.session());

/* passport.serializeUser(function(user, done) {
    done(null, user.google_id);
});
  
passport.deserializeUser(function(id, done) {
    let user = db.findUserById(id);
    done(null, user.google_id);
}); */

passport.serializeUser(function(user, done) {
    done(null, user);
});
  
passport.deserializeUser(function(user, done) {
    done(null, user);
});

var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

var db = require('./database');

var auth = keys.google;

passport.use(new GoogleStrategy({
        clientID: auth.clientID,
        clientSecret: auth.clientSecret,
        callbackURL: auth.callbackURL
    },
    function(accessToken, refreshToken, profile, cb) {
        process.nextTick(function() {
            db.findUserById(profile.id, function(user) {
                if (user) {
                    console.log('Returning User: ' + user.name);
                    cb(null, user);
                } else {
                    newUser = {
                        google_id: profile.id,
                        name: profile.displayName,
                        email: profile.emails[0].value
                    }
                    db.addUser(newUser);
                    console.log('New User Created: ' + newUser);
                    cb(null, newUser);
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


