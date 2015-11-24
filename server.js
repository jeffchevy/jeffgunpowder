// SETUP
// ======================================

var express = require('express'),
    app = express(),
    mongoose = require('mongoose'),
    config = require('./config/config'),
    path = require('path'),
    morgan = require('morgan'),
    cookieParser = require('cookie-parser'),
    passport = require('passport'),
    bodyParser = require('body-parser');

// configuration ===============================================================
mongoose.connect(config.database); // connect to our database

require('./config/passport')(passport);  // pass passport for configuration


// set up our express application
app.use(morgan('combined'));  // log every request to the console
app.use(cookieParser());  // read cookies (needed for auth)
app.use(bodyParser.json()); // get information from html forms
app.use(bodyParser.urlencoded({extended: true}));
app.use(passport.initialize());

// configure our app to handle CORS requests
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');
    next();
});

// set static files location, used for requests the frontend will make.
app.use(express.static(__dirname + '/public'));


// routes ======================================================================
var apiRoutes = require('./app/routes/api')(app, express, passport); // load our routes and pass in our app and fully configured passport
app.use('/api/v1', apiRoutes);

// MAIN CATCHALL ROUTE --------------- 
// SEND USERS TO FRONTEND ------------
// has to be registered after API ROUTES
app.get('*', function (req, res) {
    res.sendFile(path.join(__dirname + '/public/app/views/index.html'));
});

// launch ======================================================================
app.listen(config.port);
console.log('Server started on http://localhost:' + config.port);