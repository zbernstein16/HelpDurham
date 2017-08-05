var express = require('express');

var mongoose = require('mongoose')
mongoose.connect("mongodb://heroku_b7frswz9:j8florr8sljd2rde6dtiilf861@ds135963.mlab.com:35963/heroku_b7frswz9");

var UserSchema = new mongoose.Schema({
  name:String,
  address:String,
  updated_at: {type:Date, default:Date.now},
});

var User = mongoose.model('User',UserSchema);

// MongoClient.connect(url, function(err, db) {
//   if (err) throw err;
//   var myObj = { "name":"Zachary", address:"Highway 37"};
// /*  db.collection("Customers").insertOne(myObj,function(err,res) {
//       if (err) throw err;
//       console.log("One user inserted");
//       db.close();
//   }); */
// });

var app = express();

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function(request, response) {


  var user = new User({name:'Zach',address:'17 Hill'});
  user.save(function(error) {
      if(error)
        console.log(error);
      else
        console.log(user);
  });

});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
