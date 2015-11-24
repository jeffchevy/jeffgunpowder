//var bodyParser = require(' body-parser'); 	// get body-parser
var User = require('../models/user');
var jwt = require('jsonwebtoken');
var config = require('../../config/config');

//var JwtStrategy = require('passport-jwt').Strategy;

module.exports = function (app, express, passport) {

    var apiRouter = express.Router();

    apiRouter.get('/ping', function (req, res) {
        res.json({message: 'pong'});

    });


    apiRouter.post('/authenticate',
        passport.authenticate('local', {session: false}),
        function (req, res) {

            // if user is found and password is right, create a token
            var token = jwt.sign({
                name: req.user.name,
                username: req.user.username
            }, config.secret, {
                expiresInMinutes: config.tokenExpiration
            });

            res.json({
                success: true,
                token: token
            });
        });


    // ================================================================================
    // Route Middleware ===============================================================
    // token verification =============================================================
    // anything below this middleware will require a token to access ==================
    // ================================================================================


    apiRouter.use(function (req, res, next) {
        // do logging
        console.log('Somebody just came to our app!');

        // check header or url parameters or post parameters for token
        var token = req.body.token || req.param('token') || req.headers['x-access-token'];

        // decode token
        if (token) {

            // verifies secret and checks exp
            jwt.verify(token, config.secret, function (err, decoded) {

                if (err) {
                    res.status(403).send({
                        success: false,
                        message: 'Failed to authenticate token.'
                    });
                } else {
                    // if everything is good, save to request for use in other routes
                    req.decoded = decoded;

                    next(); // make sure we go to the next routes and don't stop here
                }
            });

        } else {

            // if there is no token
            // return an HTTP response of 403 (access forbidden) and an error message
            res.status(403).send({
                success: false,
                message: 'No token provided.'
            });

        }
    });


    // on routes that end in /users
    // ----------------------------------------------------
    apiRouter.route('/users')

        // create a user (accessed at POST http://localhost:8080/users)
        .post(function (req, res) {

            var user = new User();		// create a new instance of the User model
            user.name = req.body.name;  // set the users name (comes from the request)
            user.username = req.body.username;  // set the users username (comes from the request)
            user.password = req.body.password;  // set the users password (comes from the request)

            user.save(function (err) {
                if (err) {
                    // duplicate entry
                    if (err.code == 11000)
                        return res.json({success: false, message: 'A user with that username already exists. '});
                    else
                        return res.send(err);
                }

                // return a message
                res.json({message: 'User created!'});
            });

        })

        // get all the users (accessed at GET http://localhost:8080/api/users)
        .get(function (req, res) {

            User.find({}, function (err, users) {
                if (err) res.send(err);

                // return the users
                res.json(users);
            });
        });

    // on routes that end in /users/:user_id
    // ----------------------------------------------------
    apiRouter.route('/users/:user_id')

        // get the user with that id
        .get(function (req, res) {
            User.findById(req.params.user_id, function (err, user) {
                if (err) res.send(err);

                // return that user
                res.json(user);
            });
        })

        // update the user with this id
        .put(function (req, res) {
            User.findById(req.params.user_id, function (err, user) {

                if (err) res.send(err);

                // set the new user information if it exists in the request
                if (req.body.name) user.name = req.body.name;
                if (req.body.username) user.username = req.body.username;
                if (req.body.password) user.password = req.body.password;

                // save the user
                user.save(function (err) {
                    if (err) res.send(err);

                    // return a message
                    res.json({message: 'User updated!'});
                });

            });
        })

        // delete the user with this id
        .delete(function (req, res) {
            User.remove({
                _id: req.params.user_id
            }, function (err, user) {
                if (err) res.send(err);

                res.json({message: 'Successfully deleted'});
            });
        });

    // api endpoint to get user information
    apiRouter.get('/me', function (req, res) {
        res.send(req.decoded);
    });

    return apiRouter;
};