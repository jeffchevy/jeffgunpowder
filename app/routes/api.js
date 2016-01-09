var User = require('../models/user');
var DrillLog = require('../models/drillLog');
var jwt = require('jsonwebtoken');
var config = require('../../config/config');


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
                email: req.user.email
            }, config.secret, {
                expiresInMinutes: config.tokenExpiration
            });

            res.json({
                success: true,
                token: token
            });
        });


    //Drill Log
    //TODO need to move below authentication middleware
    /**
     * Drill Log API call
     * get - Returns all drill logs
     * post - Save a drill log
     * delete - remove the drill log with the passed in ID
     */
    apiRouter.route('/drillLog')

        // Get call to return all drill logs
        .get(function (req, res) {
            DrillLog.find({}, function (err, logs) {
                if (err) res.send(err);
                res.json(logs); // return the users
            });
        })
        .post(function (req, res) {
            var drillLog = new DrillLog();		// create a new instance of the DrillLog model
            drillLog.contractorsName = req.body.contractorsName;
            drillLog.jobName = req.body.jobName;
            drillLog.logStartDate = req.body.logStartDate;
            drillLog.shotNumber = req.body.shotNumber;
            drillLog.fuelLogs = req.body.fuelLogs;
            drillLog.drillerName = req.body.drillerName;
            drillLog.auditedFlag = req.body.auditedFlag;
            drillLog.customer = req.body.customer;
            drillLog.threeRiversSupervisor = req.body.threeRiversSupervisor;
            drillLog.notes = req.body.notes;
            drillLog.stakeNumbers = req.body.stakeNumbers;
            drillLog.areaNumber = req.body.areaNumber;
            drillLog.pattern = req.body.pattern;
            drillLog.stakeNumber = req.body.stakeNumber;
            drillLog.holePositions = req.body.holePositions;

            drillLog.save(function (err) {
                if (err) {
                    return res.send(err);
                }
                res.json({message: 'Drill Log created!', drillLog: drillLog});
            });
        });


    apiRouter.route('/drillLog/:id')

        .post(function (req, res) {
            //DrillLog.findByIdAndUpdate()

            //TODO, do we want to pass in the whole document to update or just change values in a document?
            res.json({message: 'TODO - '});
        })

        .delete(function (req, res) {
            DrillLog.findByIdAndRemove(req.params.id, function (err, log) {
                if (err) {
                    res.json({message: 'There was an error deleteing the drill log. ', error: err})
                }

                res.json({message: 'Drill Log deleted!', drillLog: log})
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
            user.email = req.body.email;  // set the users email (comes from the request)
            user.password = req.body.password;  // set the users password (comes from the request)

            user.save(function (err) {
                if (err) {
                    // duplicate entry
                    if (err.code == 11000)
                        return res.json({success: false, message: 'A user with that email already exists. '});
                    else
                        return res.send(err);
                }

                // return a message
                res.json({message: 'User created!', user: user});
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
                if (req.body.email) user.email = req.body.email;
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