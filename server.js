var express = require('express');
var app = express();
var bodyParser = require('body-parser')
var cors = require('cors')
var morgan = require('morgan');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcrypt');
const saltRounds = 10;
const nodemailer = require('nodemailer');

let transporter = nodemailer.createTransport({
    host: 'smtp.zoho.com',
    port: 465,
    secure: true, // use SSL
    auth: {
        user: 'nslourdes@zoho.com',
        pass: 'Jonixxla5'
    }
});


var port = process.env.PORT || 8080;

var server = require('http').createServer(app).listen(port);
var mongoose = require('mongoose');
mongoose.set('debug', true);
var config = require('./config');
var db = mongoose.connect(config.database);
var Coord = require('./models/coordinadores');
var Notas = require('./models/notas');
var Teacher = require('./models/profesores');
var Subject = require('./models/materias');
var Student = require('./models/estudiantes');
var Father = require('./models/representantes');
var LogsP = require('.//models/logsP');
var Logs = require('./models/logs');


app.use(cors());

app.set('superSecret', config.secret);
app.use(morgan('dev'));
app.use(bodyParser.json()); // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({ // to support URL-encoded bodies
    extended: true
}));

app.post('/api/authenticate', function(req, res) {
    var type = req.body.type;
    var Model;
    switch (type) {
        case "Profesor":
            Model = Teacher;
            break;
        case "Coordinador":
            Model = Coord;
            break;
        case "Representante":
            Model = Father;
            break;
        default:
            Model = "";
    }
    if (Model === "") {
        res.json({ succes: false, message: 'Authentication Failed. User type not found' });
    } else {

        // find the user
        Model.findOne({
            username: req.body.username
        }, function(err, user) {

            if (err) throw err;

            if (!user) {
                res.json({ success: false, message: 'Authentication failed. User not found.' });
            } else if (user) {

                // check if password matches
                bcrypt.compare(req.body.password, user.password, function(err, result) {
                    if (!result) {
                        res.json({ success: false, message: 'Authentication failed. Wrong password.' });
                    } else {

                        // if user is found and password is right
                        // create a token
                        var token = jwt.sign(user, app.get('superSecret'), {
                            expiresIn: '360m' // expires in 24 hours
                        });

                        // return the information including token as JSON
                        res.json({
                            success: true,
                            message: 'Enjoy your token!',
                            token: token
                        });
                    }
                });

            }

        });
    }
});

app.post('/api/mail', function(req, res) {
    var data = req.body;
    transporter.sendMail({
            from: 'nslourdes@zoho.com',
            to: data.correos,
            subject: data.tag + ' Notificación :' + data.title,
            text: "Estimado/a " + data.pref + " " + data.name + ", " + data.txt
        },
        (error, info) => {
            if (error) {
                res.json({ info: 'error during sending mail' });
            }
            console.log('Message %s sent: %s', info.messageId, info.response);
        });
    res.json(data);
});

app.post('/api/broadcast', function(req, res) {
    var data = req.body;
    Father.find()
        .exec(function(err, fathers) {
            if (err)
                res.send(err);
            fathers.forEach(function(father) {
                transporter.sendMail({
                        from: 'nslourdes@zoho.com',
                        to: father.correo,
                        subject: data.tag + ' Notificación: ' + data.title,
                        text: "Estimado/a " + father.pref + " " + father.nombre + ", " + data.txt
                    },
                    (error, info) => {
                        if (error) {
                            res.json({ info: 'error during sending mail' });
                        }
                        console.log('Message %s sent: %s', info.messageId, info.response);
                    });
                res.json(data);
            });
        });
});

app.post('/api/coord', function(req, res) {
    bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
        req.body.password = hash;
        var newUser = new Coord(req.body);
        newUser.save((err) => {
            if (err) {
                res.json({ info: 'error during User create', error: err });
            }
            res.json({ info: 'User saved successfully', data: newUser });
        });
    });
});

app.post('/api/student', function(req, res) {
    var newStudent = new Student(req.body);
    newStudent.save((err) => {
        if (err) {
            res.json({ info: 'error during Student create', error: err });
        }
    });
    var query = { correo: req.body.correo };
    Father.findOneAndUpdate(query, { $push: { students: newStudent._id } }, function(err, father) {
        if (err) {
            res.json({ info: 'error during find Father Student created', error: err, student: newStudent });
        };
        if (father) {
            res.json({ info: 'Student saved & Father updated successfully', father: father, student: newStudent });
        } else {
            res.json({ info: 'Father not found with email:' + req.body.email });
        }
    });
});

app.post('/api/father/update', function(req, res) {
    Father.findOneAndUpdate(query, { $push: { students: req.body._id } }, function(err, father) {
        if (err) {
            res.json({ info: 'error during find Father', error: err, student: newStudent });
        };
        if (father) {
            res.json({ info: 'Father updated successfully', father: father, student: newStudent });
        } else {
            res.json({ info: 'Father not found with email:' + req.body.email });
        }
    });
});

app.post('/api/father', function(req, res) {
    bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
        req.body.password = hash;
        var newFather = new Father(req.body);
        newFather.save((err) => {
            if (err) {
                res.json({ info: 'error during Father create', error: err });
            }
            res.json({ info: 'Father saved successfully', data: newFather });
        });
    });
});

/* Read all */
app.get('/api/father', function(req, res) {
    Father.find()
        .populate('students')
        .exec(function(err, fathers) {
            if (err)
                res.send(err);
            res.json(fathers);
        });
});

app.get('/api/father/:correo', function(req, res) {
    Father.findOne({ correo: req.params.correo })
        .populate('students')
        .exec(function(err, fathers) {
            if (err)
                res.send(err);
            res.json(fathers);
        });
});



app.get('/', function(req, res) {
    res.json({ message: 'hooray! welcome to our api!' });
});

app.get('/api/test', function(req, res) {

    res.json({ message: mongoose.connection.readyState });
});




// START THE SERVER
// =============================================================================
console.log('Magic happens on port ' + port);