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
    name: String,
    message: String
});

var Hole = new Schema({
    x: Number,
    y: Number,
    z: Number,
    comments: String,
    bitSize: Number,
    date: {type: Date, default: Date.now}
});

var DrillLog = new Schema({
    name: String,
    drillerName: String,
    holes: [Hole]
});

// drill log schema
var ProjectSchema = new Schema({
    jobName: {type: String, required: true},
    contractorsName: {type: String, required: true},
    shotNumber: Number,
    bitSize: Number,
    drillerName: String,
    startDate: {type: Date, default: Date.now},
    dailyLogs: [DailyLog],
    drillLogs: [DrillLog],
    auditedFlag: {type: Boolean, default: false},
    customer: String,
    threeRiversSupervisor: String,
    notes: String,
    stakeNumbers: String,
    areaNumber: String,
    pattern: String,
    status: {type: String, default: 'active'},
    closingDate: {type: Date, default: null}
});//REMINDER - if you are setting a default value here, you need to put an if check around the stuffTheProject for that value.  --  see status.


module.exports = mongoose.model('Project', ProjectSchema);
