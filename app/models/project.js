var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var DailyLog = new Schema({
    drillNumber: String,
    date: {type: Date, default: Date.now},
    gallonsPumped: Number,
    bulkTankPumpedFrom: String,
    hourMeterStart: String,
    hourMeterEnd: String,
    percussionTime: String, // int?
    name: String,
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
    name: String,
    drillerName: String,
    holes: [Hole]
});

// drill log schema
var ProjectSchema = new Schema({
    jobName: String,
    contractorsName: String,
    shotNumber: Number,
    drillerName: String,
    startDate: {type: Date, default: Date.now},
    dailyLogs: [ DailyLog ],
    drillLogs: [ DrillLog ],
    auditedFlag: {type: Boolean, default: false},
    customer: String,
    threeRiversSupervisor: String,
    notes: String,
    stakeNumbers: String,  //TODO what is this, is this different from stakeNumber?
    areaNumber: String,
    pattern: String,
    stakeNumber: String,
});


module.exports = mongoose.model('Project', ProjectSchema);
