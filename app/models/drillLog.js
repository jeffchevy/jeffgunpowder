var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//var FuelLog = new Schema({
//    //drillNumber: String,
//    //date: String,
//    //gallonsPumped: String,
//    //bulkTankPumpedFrom: String,
//    //hourMeterStart: String,
//    //hourMeterEnd: String
//
//    name: String,
//    message: String
//});

// drill log schema
var DrillLogSchema = new Schema({
    contractorsName: String,
    jobName: String,
    logStartDate: {type: Date, default: Date.now},
    shotNumber: String, //TODO should this be an int?
    fuelLogs: {type: Array, default: []}, //todo is there a way to make this a fuelLogs type?
    drillerName: String,
    auditedFlag: {type: Boolean, default: false},
    customer: String,
    threeRiversSupervisor: String,
    notes: String,
    stakeNumbers: String,  //TODO what is this?
    areaNumber: String,
    pattern: String,
    stakeNumber: String,
    holePositions: {type: Array, default: {}} //This will hold a value of 'active' hole locations  x, y, depth values.
});


module.exports = mongoose.model('DrillLog', DrillLogSchema);
