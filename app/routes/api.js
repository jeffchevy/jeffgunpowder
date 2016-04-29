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

        // Get call to return all projects
        .get(function (req, res) {
            Project.find({}, function (err, proj) {
                if (err) {
                    res.send(err);
                }
                res.json(proj); // return the projects
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

    apiRouter.route('/drillLogs/:id')
        .get(function (req, res) {
            Project.findById(req.params.id, function (err, project) {
                if (err) {
                    res.send(err);
                }
                res.json(project.drillLogs);
            });
        })

        // CREATE --
        // Add a new drill log
        .post(function (req, res) {
            var updateObject = {
                $push: {
                    "drillLogs": {
                        name: req.body.name,
                        drillerName: req.body.drillerName,
                        holes: []
                    }
                }
            };

            Project.findByIdAndUpdate(req.params.id, updateObject, function (err, project) {
                if (err) {
                    console.log(err.message);
                    return;
                }
                else {
                    res.json({message: "Drill Log Added!"});
                }
            });
        });
    apiRouter.route('/holes/:id/:drillId/:holeId')
        // update a drill log entry
        .put(function (req, res) {
            Project.findById(req.params.id, function (err, project) {
                if (err) {
                    res.send(err);
                }
                var hole = project.drillLogs.id(req.params.drillId).holes.id(req.params.holeId);
                hole.x = req.body.x;
                hole.y = req.body.y;
                hole.z = req.body.z;
                hole.comments = req.body.comments;
                hole.bitSize = req.body.bitSize;
                project.save(function (err, obj) {
                    if (err) {
                        res.send(err);
                    }
                    // return a message
                    res.json({message: "Drill Log Entry Updated!"});
                });
            });
        });

    apiRouter.route('/drillLogs/:id/:drillId')
        //
        // Create new Drill log entry - DrillLog.Holes.hole
        .post(function (req, res) {
            Project.findById(req.params.id, function (err, project) {
                if (err) {
                    res.send(err);
                }
                var drillLog = project.drillLogs.id(req.params.drillId);
                var hole = {
                    x: req.body.x,
                    y: req.body.y,
                    z: req.body.z,
                    comments: req.body.comments,
                    bitSize: req.body.bitSize
                };
                drillLog.holes.push(hole);
                project.save(function (err, obj, test) {
                    if (err) {
                        res.send(err);
                    }
                    // we need to return the object id
                    var temp = obj.drillLogs.id(req.params.drillId);
                    var hole = temp._doc.holes[temp._doc.holes.length-1];
                    // return a message
                    res.json({message: "Drill Log Entry Added!", id: hole._id.toString()});
                });
            });

        })
        // update drill log header information
        .put(function (req, res) {
            Project.findById(req.params.id, function (err, project) {
                if (err) {
                    res.send(err);
                }
                var drillLog = project.drillLogs.id(req.params.drillId);
                drillLog.name = req.body.name;
                drillLog.drillerName = req.body.drillerName;
                project.save(function (err, obj) {
                    if (err) {
                        res.send(err);
                    }
                    // return a message
                    res.json({message: "Drill Log Updated!"});
                });
            });
        });

    // UPDATE --
    // update a daily log entry using the ProjectId and the dailyLogId
    apiRouter.route('/dailyLogs/:id/:dailyLogId')
        .put(function (req, res) {
            Project.findById(req.params.id, function (err, project) {
                if (err) {
                    res.send(err);
                }
                var dailyLog = project.dailyLogs.id(req.params.dailyLogId);
                dailyLog.drillNumber = req.body.drillNumber;
                dailyLog.gallonsPumped = req.body.gallonsPumped;
                dailyLog.bulkTankPumpedFrom = req.body.bulkTankPumpedFrom;
                dailyLog.hourMeterStart = req.body.hourMeterStart;
                dailyLog.hourMeterEnd = req.body.hourMeterEnd;
                dailyLog.percussionTime = req.body.percussionTime;
                project.save(function (err, obj) {
                    if (err) {
                        res.send(err);
                    }
                    // return a message
                    res.json({message: "Daily Log Updated!"});
                });
            });
        });

    apiRouter.route('/dailyLogs/:id')
        .get(function (req, res) {
            Project.findById(req.params.id, function (err, project) {
                if (err) {
                    res.send(err);
                }
                res.json(project.dailyLogs);
            });
        })

        // CREATE --
        // Create a new daily log for the given project id
        .post(function (req, res) {

            var updateObject = {
                $push: {
                    "dailyLogs": {
                        drillNumber: req.body.drillNumber,
                        gallonsPumped: req.body.gallonsPumped,
                        bulkTankPumpedFrom: req.body.bulkTankPumpedFrom,
                        hourMeterStart: req.body.hourMeterStart,
                        hourMeterEnd: req.body.hourMeterEnd,
                        percussionTime: req.body.percussionTime
                    }
                }
            };

            Project.findByIdAndUpdate(req.params.id, updateObject, function (err, project) {
                if (err) {
                    console.log(err.message);
                    return;
                }
                else {
                    res.json({message: "DailyLog Added!"});
                }
            });
        });
    apiRouter.route('/project/:id')

        //Get a single project
        .get(function (req, res) {
            Project.findById(req.params.id, function (err, project) {
                if (err) {
                    res.send(err);
                }

                res.json(project); // return the users
            });
        })

        // update the project with this id
        .put(function (req, res) {
            Project.findById(req.params.id, function (err, project) {
                if (err) res.send(err);

                // set the new project information if it exists in the request
                stuffTheProject(req, project);
                // save the user
                project.save(function (err) {
                    if (err) {
                        res.send(err);
                    }

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
        if (req.body.dailyLogs) {
            for (var i = 0; i < req.body.dailyLogs.length; i++) {
                var dailyLog = {
                    drillNumber: req.body.dailyLogs[i].drillNumber,
                    gallonsPumped: req.body.dailyLogs[i].gallonsPumped,
                    bulkTankPumpedFrom: req.body.dailyLogs[i].bulkTankPumpedFrom,
                    hourMeterStart: req.body.dailyLogs[i].hourMeterStart,
                    hourMeterEnd: req.body.dailyLogs[i].hourMeterEnd,
                    percussionTime: req.body.dailyLogs[i].percussionTime, // int?
                    name: req.body.dailyLogs[i].name,
                    message: req.body.dailyLogs[i].name
                };
                project.dailyLogs.push(dailyLog);
            }
        }
        project.drillLogs = [];
        if (req.body.drillLogs) {
            for (var i = 0; i < req.body.drillLogs.length; i++) {
                var holes = [];
                for (var j = 0; j < req.body.drillLogs[i].holes.length; j++) {
                    var hole = {
                        x: req.body.drillLogs[i].holes[j].x,
                        y: req.body.drillLogs[i].holes[j].y,
                        z: req.body.drillLogs[i].holes[j].z,
                        comments: req.body.drillLogs[i].holes[j].comments,
                        bitSize: req.body.drillLogs[i].holes[j].bitSize
                    };
                    holes.push(hole);
                }
                var drillLog = {
                    name: req.body.drillLogs[i].name,
                    drillerName: req.body.drillLogs[i].drillerName,
                    holes: holes
                };
                project.drillLogs.push(drillLog);
            }
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
        var token = req.body.token || req.headers['token'] || req.headers['x-access-token'];

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