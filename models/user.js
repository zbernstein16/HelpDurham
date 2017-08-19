var mongoose = require('mongoose');
var bcrypt = require('bcrypt');


var UserSchema = new mongoose.Schema({
    email: {
      type:String,
      required:true,
      unique:true,
      trim:true
    },
    password: {
      type:String,
      required:true,
    },
    orgName: {
      type:String,
      required:false,
    }
});


UserSchema.pre('save',function(next) {
  var user = this;
  bcrypt.hash(user.password,10,function(err,hash) {
    if (err) {
      return next(err);
    }
    user.password = hash;
    next();
  });
});
UserSchema.methods.comparePassword = function(passw,callback) {
  bcrypt.compare(passw,this.password, function(err,isMatch) {
    if(err) {
      return callback(err);
    }
      callback(null,isMatch);
  });
}
UserSchema.statics.authenticate = function(email,password,callback) {
  User.findOne({ email: email})
  .exec(function(err,user) {
    if(err) {
      return callback(err);
    } else if (!user) {
      var err = new Error('User not found');
      err.status = 401;
      return callback(err);
    }
    bcrypt.compare(password,user.password, function(err,result) {
      if(result === true) {
        return callback(null,user);
      } else {
        return callback();
      }
    });
  });

}

var User = mongoose.model('User', UserSchema, 'Users');
module.exports = User;
