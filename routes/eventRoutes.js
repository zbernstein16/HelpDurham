var express = require('express');
var passport = require('passport');
var app = module.exports = express();

var User = require('../models/user.js');
var Event = require('../models/event.js');
var tokenHandler = require('../models/tokenHandler.js');



app.post('/events', function(req, res) {

    tokenHandler.authenticate(req.headers,function(error,user) {

      if (error || !user) {
        return res.json({success: false, msg: 'Authentication failed'});
      } else {
        var title = req.body.title;
        var desc = req.body.desc;
        var orgName = req.body.orgName;
        var date = new Date(req.body.date);
        var orgEmail = req.body.orgEmail;

        console.log(title + " " + desc + " " + orgName);



        Event.create({
            title: title,
            desc: desc,
            orgName: orgName,
            date: date,
            orgEmail:orgEmail
        }, function(err) {
            if (err) {
                return res.json({success:false, msg:'Failed to post', err:err});
            } else {
                return res.json({success:true, msg:'Event Posted'});
            }
        });
      }
    })
});


//Get event by title
app.get('/events', function(req, res) {

  tokenHandler.authenticate(req.headers,function(error,user) {

          if (error || !user) {
            return res.json({success: false, msg: 'Authentication failed'});
          } else {
          //Query by Date
          if (req.query.date !== undefined) {
              console.log("Query by Date");
              //Date format YYYY-MM-DD
              var onDateString = req.query.date;
              var onDate = new Date(onDateString);
              console.log(onDate);

              Event.find({
                  date:onDate
              }, function(error, events) {
                  if (error) {
                      return res.json({success:false, msg:'Failed to find events'});
                  } else {
                      return res.json({success:true, events:events});
                  }
              });

              return
          }
          //Query by title
          if (req.query.title !== undefined) {
              console.log("Query event by Name");
              var eventTitle = req.query.title;
              Event.find({
                  title: new RegExp(eventTitle, 'i')
              }, function(error, events) {
                  if (error) {
                      return res.json({success:false, msg:'Failed to find events'});
                  } else {
                      return res.json({success:true, events:events});
                  }
              });
              return
          }


          //Query by email
          if(req.query.email !== undefined) {
            console.log('Query by email')
            var eventEmail = req.query.email;
            Event.find({
              email:eventEmail
            },function(error,events) {
              if(error) {
                return res.json({success:false,msg:'Failed to find events'})
              } else {
                return res.json({success:true,events:events});
              }
            });
            return
          }

          return res.json({success:false, msg:'Failed to find events'});
        }
  });
});
