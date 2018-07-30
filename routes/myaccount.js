var express = require('express');
var router = express.Router();

var mongodb = require('mongodb');

var app = express();

var cookieParser = require('cookie-parser');
app.use(cookieParser());

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({
  extended: true
}));

/* GET home page. */
var handlebars = require('express-handlebars').create({
  defaultLayout: 'main'
});

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
var port = "5000";
app.set('port', port);
// Create a directory called public and then a directory named img inside of it
app.use(express.static(__dirname + '/public'));

//MYACCOUNT
app.get('/student', function (req, res) {
    var mongoClient = mongodb.MongoClient;
  
    var url = "mongodb://localhost:27017/schoolboard";
  
    mongoClient.connect(url, function (err, db) {
      if (err) {
        console.log("Couldn't connect to database.");
      } else {
        var username = req.cookies.username;
        var collection = db.collection('login');
        collection.findOne({
          "username": username,
        }, function (err, result) {
          if (err) {
            console.log("error");
            res.redirect('/signup-login')
          } else if (result) {
            console.log(result.name);
            res.render('myaccount-student', {
              student: result
            });
          } else {
            console.log(result);
            res.redirect('/signup-login')
          }
        })
      }
    })
  });
  
  app.get('/rep', function (req, res) {  
  
    var mongoClient = mongodb.MongoClient;
  
    var url = "mongodb://localhost:27017/schoolboard";
  
    mongoClient.connect(url, function (err, db) {
      if (err) {
        console.log("Couldn't connect to database.");
      } else {
        var username = req.cookies.username;
        var collection = db.collection('login');
        collection.findOne({
          "username": username,
        }, function (err, result) {
          if (err) {
            console.log("error");
            res.redirect('/signup-login')
          } else if (result) {
            console.log(result.name);
            res.render('myaccount-rep', {
              rep: result
            });
          } else {
            console.log(result);
            res.redirect('/signup-login')
          }
        })
      }
    })
  });
  
  app.get('/ambassador', function (req, res) {
    var mongoClient = mongodb.MongoClient;
  
    var url = "mongodb://localhost:27017/schoolboard";
  
    mongoClient.connect(url, function (err, db) {
      if (err) {
        console.log("Couldn't connect to database.");
      } else {
        var username = req.cookies.username;
        var collection = db.collection('login');
        collection.findOne({
          "username": username,
        }, function (err, result) {
          if (err) {
            console.log("error");
            res.redirect('/signup-login')
          } else if (result) {
            console.log(result.name);
            res.render('myaccount-ambassador', {
              ambassador: result
            });
          } else {
            console.log(result);
            res.redirect('/signup-login')
          }
        })
      }
    })
  });

module.exports = router;
