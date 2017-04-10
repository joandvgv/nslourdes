var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CoordinadorSchema = new Schema({
    name: String,
    username: String,
    password: String
});

module.exports = mongoose.model('Coordinador', CoordinadorSchema, 'coordinadores');