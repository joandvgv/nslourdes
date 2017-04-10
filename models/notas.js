var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var NotasSchema = new Schema({
    lapso: String,
    primer: { type: Number, min: 0, max: 20 },
    segundo: { type: Number, min: 0, max: 20 },
    definitiva: { type: Number, min: 0, max: 20 },
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student' },
    materia: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject' }
});

module.exports = mongoose.model('Notas', NotasSchema, 'notas');