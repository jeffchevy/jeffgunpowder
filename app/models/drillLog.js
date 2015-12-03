var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// drill log schema
var DrillLogSchema = new Schema({
    name: String


});


module.exports = mongoose.model('DrillLog', DrillLogSchema);