var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var TeacherSchema = new Schema({
    name: String,
    username: String,
    password: String
});

module.exports = mongoose.model('Teacher', TeacherSchema, 'profesores');