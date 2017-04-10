var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var FatherSchema = new Schema({
    nombre: String,
    correo: String,
    telf: String,
    students: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Student' }],
    username: String,
    password: String,
    moroso: { type: Boolean, default: false }
});

module.exports = mongoose.model('Father', FatherSchema, 'representantes');