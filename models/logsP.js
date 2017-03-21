
var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var logsPSchema   = new Schema({
    hora: String,
    fecha: String,
    CI: String,
    op: String
});

module.exports = mongoose.model('logsP', logsPSchema, 'logsP');


