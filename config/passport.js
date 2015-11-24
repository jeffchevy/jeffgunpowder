//Load up the strategies
var LocalStrategy = require('passport-local').Strategy;

//Load up the user model
var User = require('./../app/models/user');

module.exports = function (passport) {


    // =========================================================================
    // LOCAL LOGIN =============================================================
    // =========================================================================

    passport.use(new LocalStrategy(
        function (username, password, done) {
            User.findOne({username: username}, function (err, user) {

                if (err) {
                    return done(err);
                }
                if (!user) {
                    return done(null, false, {message: 'Incorrect username.'}); //TODO where does message get used?  Is this only for flash messages?  If this is displayed, I need to return the same message for username and password.
                }
                if (!user.comparePassword(password)) {
                    return done(null, false, {message: 'Incorrect password.'});
                }
                return done(null, user);
            });
        }
    ));

};


