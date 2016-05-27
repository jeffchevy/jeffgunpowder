var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var DailyLog = new Schema({
    drillNumber: String,
    date: {type: Date, default: Date.now},
    gallonsPumped: Number,
    bulkTankPumpedFrom: String,
    hourMeterStart: Number,
    hourMeterEnd: Number,
    percussionTime: Number,
    message: String
});

var Hole = new Schema({
    x: Number,
    y: Number,
    z: Number,
    comments: String,
    bitSize: String,
    date: {type: Date, default: Date.now}
});

var DrillLog = new Schema({
    name: {type: String, required: true},
    drillerName: {type: String, required: true},
    pattern: {type: String, required: true},
    shotNumber: {type: Number, required: true},
    bitSize: {type: String, required: true},
    holes: [Hole]
});

// drill log schema
var ProjectSchema = new Schema({
    projectName: {type: String, required: true},
    contractorName: {type: String, required: true},
    dailyLogs: [DailyLog],
    drillLogs: [DrillLog],
    auditedFlag: {type: Boolean, default: false},
    customer: String,
    supervisor: String,
    notes: String,
    stakeNumbers: String,
    areaNumber: String,
    status: {type: String, default: 'active'},
    closingDate: {type: Date, default: null}
});//REMINDER - if you are setting a default value here, you need to put an if check around the stuffTheProject for that value.  --  see status.


module.exports = mongoose.model('Project', ProjectSchema);
