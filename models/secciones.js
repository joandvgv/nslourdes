var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var SeccionSchema = new Schema({
    nombre: String,
    materias: [{ materia: String, type: mongoose.Schema.Types.ObjectId, ref: 'Teacher' }],
    students: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Student' }]
});

module.exports = mongoose.model('Seccion', SeccionSchema, 'Secciones');