//Load up the strategies
var LocalStrategy = require('passport-local').Strategy;

//Load up the user model
var User = require('./../app/models/user');

module.exports = function (passport) {


    // =========================================================================
    // LOCAL LOGIN =============================================================
    // =========================================================================

    passport.use(new LocalStrategy({
            // by default, local strategy uses username and password, we will override with email
            usernameField : 'email',
            passwordField : 'password',
            passReqToCallback : true // allows us to pass back the entire request to the callback
    },
        function (req, email, password, done) {

            User.findOne({email: email}, function (err, user) {

                if (err) {
                    return done(err);
                }
                if (!user) {
                    return done(null, false, {message: 'Incorrect email or password.'});
                }
                if (!user.comparePassword(password)) {
                    return done(null, false, {message: 'Incorrect email or password.'});
                }
                return done(null, user);
            });
        }
    ));

};


