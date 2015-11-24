// BASE SETUP
// ======================================

// CALL THE PACKAGES --------------------
var express = require('express');
var app = express();
var config = require('./config');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var winston = require('winston');
var path = require('path');

// APP CONFIGURATION ==================
// ====================================
// use body parser so we can grab information from POST requests
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json({limit: '50mb'}));

// set the public folder to serve public assets
app.use(express.static(__dirname + '/public'));


// connect to our database
//mongoose.connect(config.database);


// ROUTES FOR OUR API =================
// ====================================

// API ROUTES ------------------------
var apiRouter = require('./app/routes/api')(app, express);
app.use('/api/v1', apiRouter);


// ANGULAR CATCH ALL ==================
// ====================================
//catch all to catch any url not defined above.  Make sure this is after the api routes and other needed routes.
app.get('*', function (req, res) {
    res.sendFile(path.join(__dirname + '/public/app/views/index.html'));
});

//ERROR HANDLING =====================
//====================================
app.use(function (err, req, res, next) {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// START THE SERVER =================
app.listen(1337);
console.log('Listening on port 1337');