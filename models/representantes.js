var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var FatherSchema = new Schema({
    nombre: String,
    students: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Student' }],
    username: String,
    password: String,
    moroso: Boolean
});

module.exports = mongoose.model('Father', FatherSchema, 'representantes');