var User = require('../models/user');
var Project = require('../models/project');
var jwt = require('jsonwebtoken');
var config = require('../../config/config');
var moment = require('moment');

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
                token: token,
                username: req.user.name
            });
        });


    // ================================================================================
    // Route Middleware ===============================================================
    // token verification =============================================================
    // anything below this middleware will require a token to access ==================
    // ================================================================================


    apiRouter.use(function (req, res, next) {
        // do logging
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


    //Project
    /**
     * Project API call
     * get - Returns all Project info
     * post - Save a project
     * delete - remove the project with the passed in ID
     */
    apiRouter.route('/project')

    // Get call to return all projects
        .get(function (req, res) {
            Project.find({}, null, {sort: {projectName: 1}}, function (err, proj) {
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
                    if (err.name == 'ValidationError') {
                        for (field in err.errors) {
                            console.log(err.errors[field].message);
                        }
                    }
                    return res.status(400).send({message: err.errors[field].message});
                }
                res.json({success: true, message: 'Project created!', project: project});
            });
        });

    /**
     * ActiveProjects
     *  get - Will return all projects that have a status of active.
     */
    apiRouter.route('/activeProjects')
        .get(function (req, res) {
            Project.find({status: 'active'}, function (err, proj) {
                if (err) {
                    res.send(err);
                }
                res.json(proj); // return the projects
            });
        });

    /**
     * ClosedProjects
     *  get - Will return all projects that have a status of closed
     */
    apiRouter.route('/closedProjects')
        .get(function (req, res) {
            Project.find({status: 'closed'}, function (err, proj) {
                if (err) {
                    res.send(err);
                }
                res.json(proj); // return the projects
            });
        });

    /**
     * DeletedProjects
     *  get - Will return all projects that have a status of deleted.
     */
    apiRouter.route('/deletedProjects')
        .get(function (req, res) {
            Project.find({status: 'deleted'}, function (err, proj) {
                if (err) {
                    res.send(err);
                }
                res.json(proj); // return the projects
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
            Project.findById(req.params.id, function (err, project) {
                if (err) {
                    res.send(err);
                }
                else {

                    var drillLog = {
                        name: req.body.name,
                        drillerName: req.body.drillerName,
                        pattern: req.body.pattern,
                        shotNumber: req.body.shotNumber,
                        bitSize: req.body.bitSize,
                        holes: [],
                        customerSignature: req.body.customerSignature,
                        customerSignatureDate: req.body.customerSignatureDate,
                        customerSignatureName: req.body.customerSignatureName,
                        supervisorSignature: req.body.supervisorSignature,
                        supervisorSignatureDate: req.body.supervisorSignatureDate,
                        supervisorSignatureName: req.body.supervisorSignatureName
                    };

                    project.drillLogs.push(drillLog);
                    project.save(function (err, obj, test) {
                        if (err) {
                            res.send(err);
                        }
                        if (obj != null) {
                            // we need to return the object id
                            var drillLog = obj.drillLogs[obj.drillLogs.length - 1];
                            // return a message
                            // we need to return the object id
                            res.json({success: true, message: "Drill Log Added!", id: drillLog._id.toString()});
                        } else {
                            res.json({status: false, message: "Failed to add!"});
                        }

                    });
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
                hole.date = req.body.date;
                hole.bitSize = req.body.bitSize;
                project.save(function (err, obj) {
                    if (err) {
                        res.send(err);
                    }
                    // return a message
                    res.json({success: true, message: "Drill Log Entry Updated!"});
                });
            });
        });

    apiRouter.route('/drillLogs/:id/:drillId')
    //
    // Create new Drill log entry - DrillLog.Holes.hole
        .post(function (req, res) {
            Project.findById(req.params.id, function (err, project) {
                if (err || project == null) {
                    res.send(err);
                }
                if (project != null) {

                    var drillLog = project.drillLogs.id(req.params.drillId);
                    if (drillLog != null) {
                        //{x : req.body.x, y: req.body.y, z:req.body.z }
                        var checkHoles = drillLog.holes.filter(function (i) {
                            return (i.x == req.body.x && i.y == req.body.y);
                        });
                        if (checkHoles.length > 0) {
                            res.json({
                                success: true,
                                message: "Drill Log Entry Added Previously!",
                                id: checkHoles[0]._id.toString()
                            });
                        }
                        else {
                            var hole = {
                                x: req.body.x,
                                y: req.body.y,
                                z: req.body.z,
                                date: req.body.date,
                                comments: req.body.comments,
                                bitSize: req.body.bitSize,
                            };

                            if (drillLog.holes == undefined) {
                                drillLog.holes = [];
                            }
                            drillLog.holes.push(hole);
                            project.save(function (err, obj, test) {
                                if (err) {
                                    res.send(err);
                                }
                                // we need to return the object id
                                var temp = obj.drillLogs.id(req.params.drillId);
                                var hole = temp._doc.holes[temp._doc.holes.length - 1];
                                // return a message
                                res.json({success: true, message: "Drill Log Entry Added!", id: hole._id.toString()});
                            });
                        }
                    }
                    else {
                        res.status(400).send({
                            success: false,
                            message: "Project: [" + req.params.id + "] Cannot get drillLog for id: [" + req.params.drillId + "]"
                        });

                    }
                }
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
                drillLog.pattern = req.body.pattern;
                drillLog.shotNumber = req.body.shotNumber;
                drillLog.bitSize = req.body.bitSize;
                drillLog.customerSignature = req.body.customerSignature;
                drillLog.customerSignatureDate = req.body.customerSignatureDate;
                drillLog.customerSignatureName = req.body.customerSignatureName;
                drillLog.supervisorSignature = req.body.supervisorSignature;
                drillLog.supervisorSignatureDate = req.body.supervisorSignatureDate;
                drillLog.supervisorSignatureName = req.body.supervisorSignatureName;
                project.save(function (err, obj) {
                    if (err) {
                        res.send(err);
                    }
                    // return a message
                    res.json({success: true, message: "Drill Log Updated!"});
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
                dailyLog.date = req.body.date;
                project.save(function (err, obj) {
                    if (err) {
                        res.send(err);
                    }
                    // return a message
                    res.json({success: true, message: "Daily Log Updated!"});
                });
            });
        });

    apiRouter.route('/dailyLogs/:id')
        .get(function (req, res) {
            Project.findById(req.params.id, function (err, project) {
                if (err) {
                    res.send(err);
                }
                res.json(project.dailyLogs.sort({date: -1}));
            });
        })

        // CREATE --
        // Create a new daily log for the given project id
        .post(function (req, res) {

            Project.findById(req.params.id, function (err, project) {
                if (err) {
                    res.send(err);
                }
                else {

                    var dailyLog = {
                        drillNumber: req.body.drillNumber,
                        gallonsPumped: req.body.gallonsPumped,
                        bulkTankPumpedFrom: req.body.bulkTankPumpedFrom,
                        date: req.body.date,
                        hourMeterStart: req.body.hourMeterStart,
                        hourMeterEnd: req.body.hourMeterEnd,
                        percussionTime: req.body.percussionTime
                    };

                    project.dailyLogs.push(dailyLog);
                    project.save(function (err, obj, test) {
                        if (err) {
                            res.send(err);
                        }
                        // we need to return the object id
                        var dailyLog = obj.dailyLogs[obj.dailyLogs.length - 1];
                        // return a message
                        // we need to return the object id
                        res.json({success: true, message: "DailyLog Added!", id: dailyLog._id.toString()});
                    });
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

                var holeMap = {}; //Used to store the hole count.


                //Look through the drillLogs for dates and count the number of holes on each date
                project.drillLogs.forEach(function (dl) {
                        var drillLogsDepthTotal = 0;
                        var drillLogsCountTotal = 0;
                        var shotMap = {};
                        dl.holes.forEach(function (hole) {
                            var d = moment(hole.date).format("MM-DD-YYYY");
                            if (!(d in holeMap)) {
                                holeMap[d] = {numberHolesDrilled: 1, totalDailyDepth: hole.z};


                            }
                            else {
                                holeMap[d].numberHolesDrilled = holeMap[d].numberHolesDrilled + 1;
                                holeMap[d].totalDailyDepth = holeMap[d].totalDailyDepth + hole.z;
                            }

                            //Creating holeDepth map
                            if (!(hole.z in shotMap)) {
                                shotMap[hole.z] = 1
                            } else {
                                shotMap[hole.z]++;
                            }


                            //Add to the drillLogs totals
                            drillLogsCountTotal++;
                            drillLogsDepthTotal = drillLogsDepthTotal + hole.z;
                        });

                        //look through the daily logs for matching dates and add the # of holes drilled
                        project.dailyLogs.forEach(function (dailyLog) {
                            var dailyLogDate = moment(dailyLog.date).format("MM-DD-YYYY");
                            dailyLog._doc.numberOfHolesDrilled = getHoleValue('numberHolesDrilled', holeMap[dailyLogDate]);
                            dailyLog._doc.totalDailyDepth = getHoleValue('totalDailyDepth', holeMap[dailyLogDate]);
                        });

                        dl._doc.totalCount = drillLogsCountTotal;
                        dl._doc.totalDepth = drillLogsDepthTotal;
                        dl._doc.shotMap = shotMap;
                    }
                );


                res.json(project); // return the users
            });
        })

        // update the project with this id
        .put(function (req, res) {
            Project.findById(req.params.id, function (err, project) {
                if (err) res.send(err);

                // set the new project information if it exists in the request
                project.contractorName = req.body.contractorName;
                project.projectName = req.body.projectName;

                // save the user
                project.save(function (err) {
                    if (err) {
                        res.send(err);
                    }

                    // return a message
                    res.json({success: true, message: 'project updated!'});
                });

            });
        })

        .delete(function (req, res) {
            Project.findById(req.params.id, function (err, project) {
                if (err) res.send(err);

                // set the new project information if it exists in the request
                project.status = 'deleted';

                // save the user
                project.save(function (err) {
                    if (err) {
                        res.send(err);
                    }
                    // return a message
                    res.json({success: true, message: 'project deleted!'});
                });
            });
        });

    stuffTheProject = function (req, project) {
        project.contractorName = req.body.contractorName;
        project.projectName = req.body.projectName;
        if (req.body.auditedFlag != null) {
            project.auditedFlag = req.body.auditedFlag;
        }
        project.customer = req.body.customer;
        project.supervisor = req.body.supervisor;
        project.notes = req.body.notes;
        project.stakeNumbers = req.body.stakeNumbers;
        project.areaNumber = req.body.areaNumber;
        if (req.body.status != null) {
            project.status = req.body.status;
        }
        project.closingDate = req.body.closingDate;
        project.dailyLogs = [];
        if (req.body.dailyLogs) {
            for (var i = 0; i < req.body.dailyLogs.length; i++) {
                var dailyLog = {
                    drillNumber: req.body.dailyLogs[i].drillNumber,
                    gallonsPumped: req.body.dailyLogs[i].gallonsPumped,
                    bulkTankPumpedFrom: req.body.dailyLogs[i].bulkTankPumpedFrom,
                    hourMeterStart: req.body.dailyLogs[i].hourMeterStart,
                    hourMeterEnd: req.body.dailyLogs[i].hourMeterEnd,
                    percussionTime: req.body.dailyLogs[i].percussionTime,
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
                if (req.body.drillLogs[i].holes) {
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
                }
                var drillLog = {
                    name: req.body.drillLogs[i].name,
                    drillerName: req.body.drillLogs[i].drillerName,
                    pattern: req.body.drillLogs[i].pattern,
                    shotNumber: req.body.drillLogs[i].shotNumber,
                    bitSize: req.body.drillLogs[i].bitSize,
                    holes: holes,
                    customerSignature: req.body.drillLogs[i].customerSignature,
                    customerSignatureDate: req.body.drillLogs[i].customerSignatureDate,
                    customerSignatureName: req.body.drillLogs[i].customerSignatureName,
                    supervisorSignature: req.body.drillLogs[i].supervisorSignature,
                    supervisorSignatureDate: req.body.drillLogs[i].supervisorSignatureDate,
                    supervisorSignatureName: req.body.drillLogs[i].supervisorSignatureName
                };
                project.drillLogs.push(drillLog);
            }
        }
    };
    apiRouter.get('/test', function (req, res) {
        res.json({success: true, message: 'valid'});
    });


    return apiRouter;
};

/**
 * Used to get the value of numberHolesDrilled and totalDailyDepth.  It has a try catch to return 0 if there was no value.
 * @param name
 * @param holeMap
 * @returns {*}
 */
function getHoleValue(name, holeMap) {
    try {
        switch (name) {
            case 'numberHolesDrilled':
                return holeMap.numberHolesDrilled;
                break;
            case 'totalDailyDepth':
                return holeMap.totalDailyDepth;
                break;
        }
    } catch (e) {
        return 0;
    }
}