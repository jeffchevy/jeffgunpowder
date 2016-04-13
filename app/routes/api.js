var User = require('../models/user');
var Project = require('../models/project');
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


    //Project
    //TODO need to move below authentication middleware
    /**
     * Project API call
     * get - Returns all Project info
     * post - Save a project
     * delete - remove the project with the passed in ID
     */
    apiRouter.route('/project')

        // Get call to return all drill logs
        .get(function (req, res) {
            Project.find({}, function (err, proj) {
                if (err) res.send(err);
                res.json(proj); // return the users
            });
        })
        .post(function (req, res) {
            var project = new Project();		// create a new instance of the Project model
            stuffTheProject(req, project);

            project.save(function (err) {
                if (err) {
                    return res.send(err);
                }
                res.json({message: 'Project created!', project: project});
            });
        });


    apiRouter.route('/project/:id')

        //Get a single project
        .get(function (req, res) {
            Project.findById(req.params.id, function (err, project) {
                if (err) res.send(err);

                res.json(project); // return the users
            });
        })

        // update the project with this id
        .put(function (req, res) {
            Project.findById(req.params.id, function (err, project) {
                if (err) res.send(err);

                // set the new project information if it exists in the request
                stuffTheProject(req, project)
                // save the user
                project.save(function (err) {
                    if (err) res.send(err);

                    // return a message
                    res.json({message: 'project updated!'});
                });

            });
        })

        .delete(function (req, res) {
            Project.findByIdAndRemove(req.params.id, function (err, project) {
                if (err) {
                    res.json({message: 'There was an error deleteing the project. ', error: err})
                }

                res.json({message: 'Project deleted!', project: project})
            });


        });

    stuffTheProject = function (req, project) {
        project.contractorsName = req.body.contractorsName;
        project.jobName = req.body.jobName;
        project.logStartDate = req.body.logStartDate;
        project.shotNumber = req.body.shotNumber;
        project.drillerName = req.body.drillerName;
        project.auditedFlag = req.body.auditedFlag;
        project.customer = req.body.customer;
        project.threeRiversSupervisor = req.body.threeRiversSupervisor;
        project.notes = req.body.notes;
        project.stakeNumbers = req.body.stakeNumbers;
        project.areaNumber = req.body.areaNumber;
        project.pattern = req.body.pattern;
        project.stakeNumber = req.body.stakeNumber;
        project.dailyLogs = [];
        for (var i=0;i<req.body.dailyLogs.length;i++) {
            var dailyLog = {
                drillNumber: req.body.dailyLogs[i].name,
                gallonsPumped: req.body.dailyLogs[i].gallonsPumped,
                bulkTankPumpedFrom: req.body.dailyLogs[i].bulkTankPumpedFrom,
                hourMeterStart: req.body.dailyLogs[i].hourMeterStart,
                hourMeterEnd: req.body.dailyLogs[i].hourMeterEnd,
                percussionTime: req.body.dailyLogs[i].percussionTime, // int?
                name: req.body.dailyLogs[i].name,
                message: req.body.dailyLogs[i].name
            }
            project.dailyLogs.push(dailyLog);
        }
        project.drillLogs = [];
        for(var i=0;i<req.body.drillLogs.length;i++) {
            var holes = [];
            for (var j=0;j<req.body.drillLogs[i].holes.length;j++) {
                var hole = {
                    x: req.body.drillLogs[i].holes[j].x,
                    y: req.body.drillLogs[i].holes[j].y,
                    z: req.body.drillLogs[i].holes[j].z,
                    comments: req.body.drillLogs[i].holes[j].comments,
                    bitSize: req.body.drillLogs[i].holes[j].bitSize
                }
                holes.push(hole);
            }
            var drillLog = {
                name: req.body.drillLogs[i].name,
                drillerName: req.body.drillLogs[i].drillerName,
                holes: holes
            }
            project.drillLogs.push(drillLog);
        }
    };

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