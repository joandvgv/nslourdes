
var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var PeopleSchema   = new Schema({
    CI: String,
    nombre: String,
    edad: String,
    sede: String,
    carrera: String,
    enCampus: Boolean,
    vehiculo: {
    	mtrAuto: String,
    	venCampus: Boolean
    }
});

module.exports = mongoose.model('personas', PeopleSchema);


