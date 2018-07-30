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

var handlebars = require('express-handlebars').create({
  defaultLayout: 'main'
});

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
var port = "5000";
app.set('port', port);
// Create a directory called public and then a directory named img inside of it
app.use(express.static(__dirname + '/public'));

app.get('/', function (req, res) {
  // Point at the home.handlebars view
  res.render('home');
});

app.get('/signup-login', function (req, res) {
  // Point at the signup-login.handlebars view
  res.render('signup-login');
});

//SIGNUP PAGES
app.get('/signup/student', function (req, res) {
  // Point at the signup-student.handlebars view
  res.render('signup-student');
});

app.get('/signup/rep', function (req, res) {
  // Point at the signup-rep.handlebars view
  res.render('signup-rep');
});

app.get('/signup/ambassador', function (req, res) {
  // Point at the signup-ambassador.handlebars view
  res.render('signup-ambassador');
});

//LOGIN PAGE
app.post('/authenticateuser', function (req, res) {
  var MongoClient = mongodb.MongoClient;
  var url = 'mongodb://localhost:27017/schoolboard';
  MongoClient.connect(url, function (err, db) { // Connect to the server
    if (err) {
      console.log('Unable to connect to the Server:', err);
    } else {
      console.log('Connected to Server');
      var username = req.body.username;
      var pass = req.body.pass;
      var collection = db.collection('login');
      collection.find({
        "username": username,
        "password": pass,
      }).toArray(function (err, result) {
        if (err) {
          console.log(err);
        } else if (result.length) {
          //set COOKIE
          res.cookie("username", username);
          if (result[0].type == "ambassador") {
            res.redirect("myaccount/ambassador"); // Redirect to the updated student list
          } else if (result[0].type == "student") {
            res.redirect("myaccount/student");
          } else if (result[0].type == "rep") {
            res.redirect("myaccount/rep");
          } else {
            console.log('account type not set')
            res.redirect('signup-login');
          }
        } else {
          console.log(result);
          res.redirect('signup-login');
        }
        db.close();
      });
    }
  });
});

//REGISTRATION

//student
app.post('/addstudent', function (req, res) {
  var MongoClient = mongodb.MongoClient;
  var url = 'mongodb://localhost:27017/schoolboard';
  MongoClient.connect(url, function (err, db) { // Connect to the server
    if (err) {
      console.log('Unable to connect to the Server:', err);
    } else {
      console.log('Connected to Server');
      var collection = db.collection('login'); // Get the documents collection
      var student1 = {
        name: req.body.Name,
        HSyear: req.body.HSYear, // Get the student data    	city: req.body.city, state: req.body.state, sex: req.body.sex,
        HighSchool: req.body.HighSchool,
        admissionYear: req.body.admissionYear,
        email: req.body.Email,
        username: req.body.Username,
        password: req.body.Password,
        schoolsFollowing: [],
        type: "student"
      };
      collection.insert([student1], function (err, result) { // Insert the student data
        if (err) {
          console.log(err);
        } else {
          res.redirect("/"); // Redirect to home
        }
      });
    }
  });
});

//ambassador
app.post('/addambassador', function (req, res) {
  var MongoClient = mongodb.MongoClient;
  var url = 'mongodb://localhost:27017/schoolboard';
  MongoClient.connect(url, function (err, db) { // Connect to the server
    if (err) {
      console.log('Unable to connect to the Server:', err);
    } else {
      console.log('Connected to Server');
      var collection = db.collection('login'); // Get the documents collection
      var ambassador1 = {
        name: req.body.Name,
        gradYear: req.body.gradYear, // Get the student data    	city: req.body.city, state: req.body.state, sex: req.body.sex,
        year: req.body.year,
        major: req.body.major,
        email: req.body.Email,
        bio: req.body.Bio,
        username: req.body.Username,
        password: req.body.Password,
        type: "ambassador"
      };
      collection.insert([ambassador1], function (err, result) { // Insert the student data
        if (err) {
          console.log(err);
        } else {
          res.redirect("/"); // Redirect to home
        }
      });
    }
  });
});

//rep
app.post('/addrep', function (req, res) {
  var MongoClient = mongodb.MongoClient;
  var url = 'mongodb://localhost:27017/schoolboard';
  MongoClient.connect(url, function (err, db) { // Connect to the server
    if (err) {
      console.log('Unable to connect to the Server:', err);
    } else {
      console.log('Connected to Server');
      var collection = db.collection('login'); // Get the documents collection
      var rep1 = {
        name: req.body.Name,
        role: req.body.Role, // Get the student data    	city: req.body.city, state: req.body.state, sex: req.body.sex,
        email: req.body.Email,
        bio: req.body.Bio,
        username: req.body.Username,
        password: req.body.Password,
        type: "rep"
      };
      collection.insert([rep1], function (err, result) { // Insert the student data
        if (err) {
          console.log(err);
        } else {
          res.redirect("/"); // Redirect to home
        }
      });
    }
  });
});

//--SCHOOLS--

//Stanford
app.get('/school/stanford', function (req, res) {
  var mongoClient = mongodb.MongoClient;

  var url = "mongodb://localhost:27017/schoolboard";

  mongoClient.connect(url, function (err, db) {
    if (err) {
      console.log("Couldn't connect to database.");
    } else {
      var name = "Stanford University";
      var collection = db.collection('schools');
      collection.findOne({
        "name": name,
      }, function (err, result) {
        if (err) {
          console.log("error");
          res.redirect('/')
        } else if (result) {
          console.log(result.name);
          res.render('school', {
            school: result,
          });
        } else {
          console.log(result);
          res.redirect('/')
        }
      })
    }
  })
});



//--ERRORS--

//404
app.use(function (req, res) {
  // Define the content type
  res.type('text/html');
  // The default status is 200
  res.status(404);
  // Point at the 404.handlebars view
  res.render('404');
});

// 500
app.use(function (err, req, res, next) {
  console.error(err.stack);
  res.status(500);
  // Point at the 500.handlebars view
  res.render('500');
});


app.listen(app.get('port'), function () {
  console.log('Express started on http://localhost:' +
    app.get('port') + '; press Ctrl-C to terminate');
});

module.exports = router;