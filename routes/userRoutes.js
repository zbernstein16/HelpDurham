var express = require('express');
var app = module.exports = express();
var jwt         = require('jwt-simple');
var config      = require('../config/database.js'); // get db config file
var User = require('../models/user.js');


app.post('/signup',function(req,res) {
  if(!req.body.email || !req.body.password) {
    res.json({success:false,msg:'Please pass email and password'});

  } else {
    //Create User
      var userData = {
        email:req.body.email,
        password:req.body.password
      }

      User.create(userData, function(err) {
          if(err) {
            return res.json({success:false, msg:'Email already taken'});
          } else {
            res.json({success:true,msg:'User successfully created'});
          }

      });
  }
})

app.post('/authenticate',function(req,res) {
  User.findOne({email:req.body.email},function(err,user) {
    if(err) {
      return res.json({success:false,msg:"Error connecting to database"})
    } if(!user) {
      res.json({success: false, msg: 'Authentication failed. User not found.'})
    } else {
      user.comparePassword(req.body.password,function(err,isMatch) {
        if(isMatch && !err) {
          var token = jwt.encode(user,config.secret);
          res.json({success: true, token:'JWT ' + token, user:user})
        } else {
          res.json({success: false, msg: 'Authentication failed. Wrong email or password.'});
        }
      })
    }
  })
});


//Get user by name
app.get('/users', function(req, res) {
    //console.log(req.query.name);
    var userName = req.query.name;
    console.log("Name is : " + userName)
    User.find({
        name: new RegExp(userName, 'i')
    }, function(error, users) {
        if (error) {
            res.status(500).send("Something Broke");
        } else {
            if (users) {

                res.json(users);
            }
        }
    });
});
