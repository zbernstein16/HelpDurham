var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var session  = require('express-session');
var passport	= require('passport');
var config      = require('./config/database'); // get db config file
var User        = require('./models/user'); // get the mongoose model
var port        = process.env.PORT || 8080;
var jwt         = require('jwt-simple');


//Configure passport
require('./config/passport')(passport);



var userRoutes = require('./routes/userRoutes.js');
var eventRoutes = require('./routes/eventRoutes.js');

//Setup app
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());
app.use(userRoutes);
app.use(eventRoutes);

//Connect to database
mongoose.connect(config.database);







//Initialize App Handlers
app.set('port', (port));

app.use(express.static(__dirname + '/public'));

app.use(session({
  secret:'daisy',
  resave:true,
  saveUninitialized:false
}));

///
/// Default Handlers
///
app.use(function (err, req, res, next) {
  console.log("Default handlers");
  res.status(err.status || 500);
  res.send(err.message);
});



app.post('/login', function(req, res) {

});

///
/// Functions
///

function requiresLogin(req,res,next) {
  if(req.session && req.session.userId) {
    return next();
  } else {
    var error = new Error('You must be logged in');
    err.status = 401;
    return next(err);
  }
}


///
/// App running
///

app.listen(port, function() {
    console.log('Node app is running on port', app.get('port'));
});
