var express = require('express');

var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://heroku_b7frswz9:j8florr8sljd2rde6dtiilf861@ds135963.mlab.com:35963/heroku_b7frswz9";

MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  console.log("Database created!");
  db.close();
});

var app = express();

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function(request, response) {
  response.render('pages/index');
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
