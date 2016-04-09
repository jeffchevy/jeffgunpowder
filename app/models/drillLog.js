var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// drill log schema
var DrillLogSchema = new Schema({
    holePositions: {type: Array, default: {}} //This will hold a value of 'active' hole locations  x, y, depth values.
});


module.exports = mongoose.model('DrillLog', DrillLogSchema);
