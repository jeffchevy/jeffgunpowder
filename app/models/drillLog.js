var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// drill log schema
var DrillLogSchema = new Schema({
    //name: String
    contractorsName: String,
    jobName: String,
    logStartDate: String, //TODO Should this be a date?
    shotNumber: String, //TODO should this be an int?
    FuelLog: {
        drillNumber: String, date: String, gallonsPumped: String,
        bulkTankPumpedFrom: String, hourMeterStart: String, hourMeterEnd: String
    }, //TODO this needs to be an object.  Also, check data types of each of these once I get this working.
    holeCountAtEachDepth: String, //TODO what is this?
    holeCount: String,
    totalDepthOfAllHolesIncludingSubDrill: String,
    avgHoleDepthIncludingSubDrill: String,
    drillerName: String,
    auditedFlag: String,
    customer: String,
    threeRiversSupervisor: String,
    notes: String,
    stakeNumbers: String,
    logDate: String,
    areaNumber: String,
    pattern: String,
    stakeNumber: String,
    drillersName: String

});


module.exports = mongoose.model('DrillLog', DrillLogSchema);




