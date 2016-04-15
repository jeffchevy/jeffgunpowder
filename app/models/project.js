var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var dailyLog = new Schema({
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

var hole = new Schema({
    x: Number,
    y: Number,
    z: Number,
    comments: String,
    bitSize: String,
    date: {type: Date, default: Date.now}
});

var drillLog = new Schema({
    name: String,
    drillerName: String,
    holes: [hole]
});

// drill log schema
var ProjectSchema = new Schema({
    jobName: String,
    contractorsName: String,
    shotNumber: Number,
    drillerName: String,
    startDate: {type: Date, default: Date.now},
    dailyLogs: [ dailyLog ],
    drillLogs: [ drillLog ],
    auditedFlag: {type: Boolean, default: false},
    customer: String,
    threeRiversSupervisor: String,
    notes: String,
    stakeNumbers: String,  //TODO what is this?
    areaNumber: String,
    pattern: String,
    stakeNumber: String,
});


module.exports = mongoose.model('Project', ProjectSchema);
