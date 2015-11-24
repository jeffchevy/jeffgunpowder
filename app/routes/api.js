///**
// * API
// * Version: 1.0
// */
//
//

var winston = require('winston');
var config = require('../../config');

module.exports = function (app, express) {

    var apiRouter = express.Router();

    /**
     * Root route.  This will display a user friendly API.
     */
    apiRouter.get('/', function (req, res) {
        res.json({message: 'TODO - info about the api here.'});  //JSON or page?
    });

    return apiRouter;
};
