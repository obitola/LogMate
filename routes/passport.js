var passport = require('passport');

router.use(passport.initialize());
router.use(passport.session());


module.exports = passport;