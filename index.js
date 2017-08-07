var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

//Setup app
var app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
mongoose.connect("mongodb://heroku_b7frswz9:j8florr8sljd2rde6dtiilf861@ds135963.mlab.com:35963/heroku_b7frswz9");


//Setup Database Schemas
var UserSchema = new mongoose.Schema({
    name: String,
    email: String,
    updated_at: {
        type: Date,
        default: Date.now
    },
});

var EventSchema = new mongoose.Schema({
    title: String,
    date:Date,
    desc: String,
    orgName: String
});

var User = mongoose.model('User', UserSchema, 'Users');
var Event = mongoose.model('Event', EventSchema, 'Events');


//Initialize App Handlers
app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));


//Posting
app.post('/postEvent', function(req,res) {
  var title = req.body.title;
  var desc= req.body.desc;
  var orgName = req.body.orgName;
  var date = new Date(req.body.date);

  console.log(title + " " + desc + " " + orgName);



  Event.create({title:title,desc:desc,orgName:orgName,date:date}, function(err) {
    if (err) {
      res.status(500).send("Something went wrong");
    } else {
      res.send("Okay");
    }
  });
});
app.post('/login', function(req, res) {
    User.findOne({
        email: req.body.email
    }, function(error, user) {
        if (error) {
            res.console.error();
        } else {
            res.send(100);
        }
    });
});


//
//  Getting
//

//Get event by title
app.get('/eventTitled', function(req,res) {
    var eventTitle = req.params.title;
    Event.find({
        title: new RegExp(eventTitle,'i')
    },function(error,events) {
      if(error) {
        res.status(500).send("Something Broke");
      } else {
        res.json(events);
      }
    });
});

//Get event on date
app.get('/eventOn',function(req,res) {

  //Note: Date format YYYY-MM-DD
  var onDateString = req.params.onDate;
  var onDate = new Date(onDateString);

  Event.find({
    date:onDate
  },function(error,events) {
      if(error) {
        res.status(500).send("Something broke");
      } else {
        res.json(events);
      }
  });
});

//Get user by name
app.get('/users', function(req, res) {

    var userName = req.params.name;
    console.log("Name is : " + userName)
    User.find({
        name: new RegExp(userName,'i')
    }, function(error, users) {
        if (error) {
            res.status(500).send("Something Broke");
        } else {
            if (users) {

                res.json(users);
            }
        }
    });

    // var user = new User({name:'Zach',address:'17 Hill'});
    // user.save(function(error) {
    //     if(error)
    //       console.log(error);
    //     else
    //       console.log(user);
    // });

});

app.listen(app.get('port'), function() {
    console.log('Node app is running on port', app.get('port'));
});
