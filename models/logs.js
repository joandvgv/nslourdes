
var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var logsSchema   = new Schema({
    hora: String,
    fecha: String,
    mtrAuto: String,
    op: String
});

module.exports = mongoose.model('logs', logsSchema);


