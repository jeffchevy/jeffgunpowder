var mongoose = require('mongoose');
var dailyLog = require('../models/dailyLog');
var drillLog = require('../models/drillLog');
var Schema = mongoose.Schema;

// drill log schema
var ProjectSchema = new Schema({
    jobName: String,
    contractorsName: String,
    shotNumber: String, //TODO should this be an int?
    drillerName: String,
    startDate: {type: Date, default: Date.now},
    drillLogs: [ drillLog ],
    dailyLogs: [ dailyLog ],
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
