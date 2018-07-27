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
      var collection = db.collection('login'); // Get the documents collection
      collection.find({
        "username": username,
        "password": pass
      }).toArray(function (err, result) { // Insert the student data
        console.log(result);
        if (err) {
          console.log(err);
        } else if (result.length) {
          //set COOKIE
          res.cookie("username", username);
          res.redirect("/"); // Redirect to the updated student list
        } else {
          console.log('redirecting to login');
          res.redirect('signup-login');
          //alert("Invalid Login Credentials");
        }
        db.close();
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
