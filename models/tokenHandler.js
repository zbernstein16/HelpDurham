var express = require('express');
var jwt = require('jwt-simple');
var config = require('../config/database');

var User = require('../models/user');
getToken = function(headers) {
    if (headers && headers.authorization) {
        var parted = headers.authorization.split(' ');
        if (parted.length === 2) {
            return parted[1];
        } else {
            return null;
        }
    } else {
        return null;
    }
}
module.exports = {

    authenticate:function(headers,callback) {

      var token = getToken(headers);
      //Callback will be funciton(error,user);
        if(token) {
            var decoded = jwt.decode(token,config.secret);
            User.findOne({
              email:decoded.email
            }, function(err,user) {
                if(err) {
                  callback(error);
                } else if(!user) {
                  callback(null,null);
                } else {
                  callback(null,user);
                }
            })
        } else {
          var error = new Error('Unauthorized');
          error.status = 401;
          callback(error);
        }
    }
}
