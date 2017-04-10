var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var StudentSchema = new Schema({
    nombre: String,
    seccion: String,
    cedula: String,
    notas: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Notas' }],
    promedio: { type: Number, min: 0, max: 20, default: 0 }
});

module.exports = mongoose.model('Student', StudentSchema, 'estudiantes');