var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var StudentSchema = new Schema({
    nombre: String,
    promedio: { type: Number, min: 0, max: 20 }
});

module.exports = mongoose.model('Student', StudentSchema, 'estudiantes');