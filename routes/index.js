var express = require('express');
var router = express.Router();

var mongodb = require('mongodb');

var app = express();

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({
  extended: true
}));

/* GET home page. */
var handlebars = require('express-handlebars').create({defaultLayout:'main'});

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
var port = "5000";
app.set('port', port);
// Create a directory called public and then a directory named img inside of it
app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res){
   // Point at the home.handlebars view
  res.render('home');
});

app.get('/signup-login', function(req, res){
    // Point at the signup-login.handlebars view
   res.render('signup-login');
 });

 //MYACCOUNT
 app.get('/myaccount/student', function(req, res){
    // Point at the myaccount-student.handlebars view
   res.render('myaccount-student');
//    if (!req.cookies.username) {
//      res.redirect('/signup-login')
//    }
//    var username = req.cookies.username;
//    collection.findOne({
//     "username": username,
//   }, function (err, result) { 
//     console.log(result);
//     if (err) {
//       res.redirect('/signup-login')
//     } else if (result.length) {
//       res.render('myaccount-student', { name: result.name});
//     }
//   }
//  )
});

 app.get('/myaccount/rep', function(req, res){
    // Point at the myaccount-rep.handlebars view
   res.render('myaccount-rep');
 });

 app.get('/myaccount/ambassador', function(req, res){
    // Point at the myaccount-ambassador.handlebars view
   res.render('myaccount-ambassador');
 });

 //SIGNUP PAGES
 app.get('/signup/student', function(req, res){
    // Point at the signup-student.handlebars view
   res.render('signup-student');
 });

 app.get('/signup/rep', function(req, res){
    // Point at the signup-rep.handlebars view
   res.render('signup-rep');
 });
 
 app.get('/signup/ambassador', function(req, res){
    // Point at the signup-ambassador.handlebars view
   res.render('signup-ambassador');
 });

//SCHOOL PAGE
app.get('/school', function(req, res){
  // Point at the school-stanford.handlebars view
 res.render('school');
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
      console.log(req);
      var username = req.body.username;
      var pass = req.body.pass;
      console.log(username);
      console.log(pass);
      var collection = db.collection('login'); 
      collection.find({
        "username": username,
        "password": pass,
      }).toArray(function (err, result) { 
        console.log(result);
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
          }
        } else {
          console.log('redirecting to login');
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


//ERRORS

//404
app.use(function(req, res) {
  // Define the content type
  res.type('text/html');
  // The default status is 200
  res.status(404);
  // Point at the 404.handlebars view
  res.render('404');
});

// 500
app.use(function(err, req, res, next) {
  console.error(err.stack);
  res.status(500);
  // Point at the 500.handlebars view
  res.render('500');
});


app.listen(app.get('port'), function(){
  console.log('Express started on http://localhost:' +
    app.get('port') + '; press Ctrl-C to terminate');
});

module.exports = router;
