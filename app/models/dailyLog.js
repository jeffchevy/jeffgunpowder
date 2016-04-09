var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var DailyLogSchema = new Schema({
    drillNumber: String,
    date: {type: Date, default: Date.now},
    gallonsPumped: String,
    bulkTankPumpedFrom: String,
    hourMeterStart: String,
    hourMeterEnd: String,
    percussionTime: String, // int?

    name: String,
    message: String
});

// drill log schema
var DrillLogSchema = new Schema({
    holePositions: {type: Array, default: {}} //This will hold a value of 'active' hole locations  x, y, depth values.
});


module.exports = mongoose.model('DailyLog', DailyLogSchema);
