var express = require('express');
var app = express();
var bodyParser = require('body-parser')
var cors = require('cors')



var port = process.env.PORT || 8080;

var server = require('http').createServer(app).listen(port);
var mongoose = require('mongoose');
var config  = require('./config');
var db      = mongoose.connect(config.database);
var People     = require('./models/personas');
var User     = require('./models/users');
var LogsP     = require('.//models/logsP');
var Logs     = require('./models/logs');


var corsOptions = {
  origin: 'http://localhost:4200',
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}
app.use(cors(corsOptions));

app.set('superSecret', config.secret);
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));


app.post('/api/user', function (req, res) {
    var newUser = new User(req.body);
    newUser.save((err)=>{
        if (err){
            res.json({info: 'error during User create', error: err});
        }
        res.json({info: 'User saved successfully', data: newUser});
    });
});



/* Read all */
app.get('/api/user', function (req, res) {
    User.find(function(err, users) {
            if (err)
                res.send(err);

            res.json(users);
        });
});



app.get('/', function(req, res) {
    res.json({ message: 'hooray! welcome to our api!' });
});


  // count all
  app.get('/api/logs/month', function(req, res) {
   date = new Date().getMonth();
   var month;
   var datePlusOne;
   datePlusOne= date + 1;
   month = ""+datePlusOne;
   var query = {month: month};
    LogsP.count(query,function(err, count) {
      if(err) return console.error(err);
      res.json(count);
    });
  });

   app.get('/api/logs/hour', function(req, res) {
   date = new Date().getHours();
   var hour;
   hour = ""+date+":";
   var query = {hora: {$regex: hour}};
    LogsP.count(query,function(err, count) {
      if(err) return console.error(err);
      res.json(count);
    });
  });



/* Find one */
app.get('/api/user/:username', function (req, res) {
    var query = { username: req.params.username};
    User.findOne(query, function(err, User) {
        if (err) {
            res.json({info: 'error during find User', error: err});
        };
        if (User) {
            res.json({info: 'User found successfully', data: User});
        } else {
            res.json({info: 'User not found with name:'+ req.params.name});
        }
    });
});

/* Find one */
app.get('/api/persona/:cedula', function (req, res) {
    var query = { CI: req.params.cedula, enCampus: true};
    People.findOne(query, function(err, User) {
        if (err) {
            res.json({info: 'error during find persona', error: err});
        };
        if (User) {
            res.json({info: 'User found successfully', data: User});
        } else {
            res.json({info: 'User not found with name:'+ req.params.cedula});
        }
    });
});






/* Find one */
app.get('/api/login/', function (req, res) {
    var query = { username: req.params.username};
    User.findOne(query, function(err, User) {
        if (err) {
            res.json({info: 'error during find User', error: err});
        };
        if (User) {
            res.json({info: 'User found successfully', data: User});
        } else {
            res.json({info: 'User not found with username:'+ req.params.username});
        }
    });
});

app.get('/api/onCampus/', function (req, res) {
    var query = {enCampus:true };
    People.find(query, function(err, People) {
        if (err) {
            res.json({info: 'Error finding people on campus', error: err});
        };
        if (People) {
            res.json({info: 'Usuarios encontrados', data: People});
        } else {
            res.json({info: 'No people on campus with status:'});
        }
    });
});

app.get('/api/onCampus/count', function (req, res) {
    var query = {enCampus:true };
    People.count(query, function(err, People) {
        if (err) {
            res.json({info: 'Error finding people on campus', error: err});
        };
        if (People) {
            res.json(People);
        } else {
            res.json({info: 'No people on campus with status:'});
        }
    });
});

app.get('/api/logs/persona', function (req, res) {
    LogsP.find((err, LogsP) => {
        if (err) {
            res.json({info: 'error during find Users', error: err});
        };
        res.json(LogsP);

    });
});


app.get('/api/logs/vehiculo', function (req, res) {
    Logs.find((err, Logs) => {
        if (err) {
            res.json({info: 'error during find Users', error: err});
        };
        res.json(Logs);
    });
});

  app.get('/api/statistics/psede/:sede', function(req, res) {
   var query = {sede: req.params.sede, enCampus: true};
    People.count(query,function(err, count) {
      if(err) return console.error(err);
      res.json(count);
    });
  });

  app.get('/api/statistics/pcarrera/:carrera', function(req, res) {
   var query = {carrera: req.params.carrera, enCampus: true};
    People.count(query,function(err, count) {
      if(err) return console.error(err);
      res.json(count);
    });
  });

     app.get('/api/statistics/pcarrerap/:carrera', function(req, res) {
   var query = {carrera: req.params.carrera, enCampus: true};
    People.count(query,function(err, count) {
      if(err) return console.error(err);
      var query2= {enCampus:true};
      People.count(query2,function(error,total){
         if(error) return console.error(err);
         res.json(Math.round((count/total)*100) + "%");
    });
    });


  });


     app.get('/api/statistics/vcarrerap/:carrera', function(req, res) {
   var query = {carrera: req.params.carrera, "vehiculo.venCampus":true};
    People.count(query,function(err, count) {
      if(err) return console.error(err);
      var query2= {"vehiculo.venCampus":true};
      People.count(query2,function(error,total){
         if(error) return console.error(err);
         res.json(Math.round((count/total)*100) + "%");
    });
    });


  });


app.get('/api/statistics/vcarrera/:carrera', function(req, res) {
   var query = {carrera: req.params.carrera, "vehiculo.venCampus":true};
    People.count(query,function(err, count) {
      if(err) return console.error(err);
      res.json(count);
    });
  });

app.get('/api/statistics/onCampus/vehicles', function(req, res) {
   var query = {"vehiculo.venCampus":true};
    People.count(query,function(err, count) {
      if(err) return console.error(err);
      res.json(count);
    });
  });


  app.post('/api/authuser/', function (request, response) {
    User.findOne({
        username: request.body.username
    }, function (error, usr) {
        if (error) { console.log('Some error  occured '); }
        if (!usr) {
            response.json({
                authsuccess: false,
                description: 'User Authentication failed because user not found.'
            });
        }
        else if (usr) {
            if (usr.password != request.body.password) {
                response.json({
                    authsuccess: false,
                    description: 'User Authentication failed because provided password is wrong.'
                });
            }else{
                 response.json({
                    authsuccess: true,
                    description: 'Sending the Access Token'
                  //  accessToken: accessToken
                });
                console.log('Authentication is done successfully.....');
            }

            }


            });
        });

  app.get('/api/test', function(req, res) {

    res.json({ message: mongoose.connection.readyState });
});




// START THE SERVER
// =============================================================================
console.log('Magic happens on port ' + port);
