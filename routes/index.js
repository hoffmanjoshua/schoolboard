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
app.set('view engine', 'handlebars'); //Set the GUI as handlebars
var port = "5000"; //Set the port to be 5000
app.set('port', port);
// Create a directory called public and then a directory named img inside of it
app.use(express.static(__dirname + '/public'));

app.get('/', function (req, res) {
  // Point at the home.handlebars view
  res.render('home', {isAuth: req.cookies.isAuth});
});

app.get('/signup-login', function (req, res) {
  // Point at the signup-login.handlebars view
  res.render('signup-login', {isAuth: req.cookies.isAuth});
});

//SIGNUP PAGES
app.get('/signup/student', function (req, res) {
  // Point at the signup-student.handlebars view
  res.render('signup-student', {isAuth: req.cookies.isAuth});
});

app.get('/signup/rep', function (req, res) {
  // Point at the signup-rep.handlebars view
  // Point at the signup-ambassador.handlebars view
  var mongoClient = mongodb.MongoClient;

  var url = "mongodb://localhost:27017/schoolboard";

  mongoClient.connect(url, function (err, db) {
    if (err) {
      console.log("Couldn't connect to database.");
    } else {
      var collection = db.collection('schools');
      collection.find().toArray(function (err, result) {
        if (err) {
          console.log("error");
          res.redirect('/signup-login')
        } else if (result) {
          console.log(result[0].name);
          res.render('signup-rep', {
            schools: result
          });
        } else {
          console.log(result);
          res.redirect('/signup-login')
        }
      })
    }
  })
});

app.get('/signup/ambassador', function (req, res) {
  // Point at the signup-ambassador.handlebars view
  var mongoClient = mongodb.MongoClient;

  var url = "mongodb://localhost:27017/schoolboard";

  mongoClient.connect(url, function (err, db) {
    if (err) {
      console.log("Couldn't connect to database.");
    } else {
      var collection = db.collection('schools');
      collection.find().toArray(function (err, result) {
        if (err) {
          console.log("error");
          res.redirect('/signup-login')
        } else if (result) {
          console.log(result[0].name);
          res.render('signup-ambassador', {
            schools: result
          });
        } else {
          console.log(result);
          res.redirect('/signup-login')
        }
      })
    }
  })
});



//MYACCOUNT

//main
app.get('/myaccount', function (req, res) {
  var MongoClient = mongodb.MongoClient;
  var url = 'mongodb://localhost:27017/schoolboard';
  MongoClient.connect(url, function (err, db) { // Connect to the server
    if (err) {
      console.log('Unable to connect to the Server:', err);
    } else {
      console.log('Connected to Server');
      var username = req.cookies.username;
      var collection = db.collection('login');
      collection.find({
        "username": username,
      }).toArray(function (err, result) {
        if (err) {
          console.log(err);
        } else if (result.length) {
          //set COOKIE
          if (result[0].type == "ambassador") {
            res.redirect("/myaccount/ambassador"); // Redirect to the updated student list
          } else if (result[0].type == "student") {
            res.redirect("/myaccount/student");
          } else if (result[0].type == "rep") {
            res.redirect("/myaccount/rep");
          } else {
            console.log('account type not set')
            res.redirect('signup-login');
          }
        } else {
          console.log(result);
          console.log('account not created')
        }
        db.close();
      });
    }
  });
});


//student
app.get('/myaccount/student', function (req, res) {
  console.log('in student');

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
            student: result,
            isAuth: req.cookies.isAuth
          });
        } else {
          console.log(result);
          res.redirect('/signup-login')
        }
      })
    }
  })
});

//ambassador
app.get('/myaccount/ambassador', function (req, res) {
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

//representative
app.get('/myaccount/rep', function (req, res) {

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
        var collection = db.collection('schools');
        collection.find({
          "name": result.school,
        }).toArray(function (err, resultschool) {
          if (err) {
            console.log("error");
            res.redirect('/signup-login')
          } else if (resultschool) {
            console.log('hello');
            console.log(resultschool);
            res.render('myaccount-rep', {
              rep: result,
              posts: resultschool[0].needsApproval
            });
          } else {
            console.log(result);
            res.redirect('/signup-login')
          }
          db.close();
        });
      })
    }
  });
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
          var isAuth = true;
          res.cookie("isAuth", isAuth);
          res.cookie("username", username);
          if (result[0].type == "ambassador") {
            res.redirect("/myaccount/ambassador"); // Redirect to the updated student list
          } else if (result[0].type == "student") {
            res.redirect("/myaccount/student");
          } else if (result[0].type == "rep") {
            res.redirect("/myaccount/rep");
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

//LOGOUT
app.post('/logout', function (req, res) {
  res.clearCookie("username");
  res.clearCookie("isAuth");
  res.redirect('/signup-login')
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
        school: req.body.school,
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
        school: req.body.school,
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

//UPDATE

//students
app.post('/updatestudent', function (req, res) {
  var MongoClient = mongodb.MongoClient;
  var url = 'mongodb://localhost:27017/schoolboard';
  MongoClient.connect(url, function (err, db) { // Connect to the server
    if (err) {
      console.log('Unable to connect to the Server:', err);
    } else {
      console.log('Connected to Server');
      var collection = db.collection('login'); // Get the documents collection
      var olddata = {
        'username': req.cookies.username
      }
      var student1 = {
        $set: {
          name: req.body.Name,
          HSyear: req.body.HSYear, // Get the student data    	city: req.body.city, state: req.body.state, sex: req.body.sex,
          HighSchool: req.body.HighSchool,
          admissionYear: req.body.admissionYear,
          email: req.body.Email,
          type: "student"
        }
      };
      collection.update(olddata, student1, function (err, result) { // Updates the student data
        if (err) {
          console.log(err);
        } else {
          res.redirect("/myaccount/student"); // Redirect to your account
        }
      });
    }
  });
});

//ambassador
app.post('/updateambassador', function (req, res) {
  var MongoClient = mongodb.MongoClient;
  var url = 'mongodb://localhost:27017/schoolboard';
  MongoClient.connect(url, function (err, db) { // Connect to the server
    if (err) {
      console.log('Unable to connect to the Server:', err);
    } else {
      console.log('Connected to Server');
      var collection = db.collection('login'); // Get the documents collection
      var olddata = {
        'username': req.cookies.username
      }
      var ambassador1 = {
        $set: {
          name: req.body.Name,
          gradYear: req.body.gradYear, // Get the student data    	city: req.body.city, state: req.body.state, sex: req.body.sex,
          year: req.body.year,
          major: req.body.major,
          email: req.body.Email,
          bio: req.body.Bio
        }
      };
      collection.update(olddata, ambassador1, function (err, result) { // Updates the student data
        if (err) {
          console.log(err);
        } else {
          res.redirect("/myaccount/ambassador"); // Redirect to your account
        }
      });
    }
  });
});

//rep
app.post('/updaterep', function (req, res) {
  var MongoClient = mongodb.MongoClient;
  var url = 'mongodb://localhost:27017/schoolboard';
  MongoClient.connect(url, function (err, db) { // Connect to the server
    if (err) {
      console.log('Unable to connect to the Server:', err);
    } else {
      console.log('Connected to Server');
      var collection = db.collection('login'); // Get the documents collection
      var olddata = {
        'username': req.cookies.username
      }
      var rep1 = {
        $set: {
          name: req.body.Name,
          role: req.body.Role, // Get the student data    	city: req.body.city, state: req.body.state, sex: req.body.sex,
          email: req.body.Email,
          bio: req.body.Bio
        }
      };
      collection.update(olddata, rep1, function (err, result) { // Updates the student data
        if (err) {
          console.log(err);
        } else {
          res.redirect("/myaccount/rep"); // Redirect to your account
        }
      });
    }
  });
});

//--POSTS--

//TODO
//ambassador submit post for approval
app.post('/submitforapproval', function (req, res) {
  var MongoClient = mongodb.MongoClient;
  var url = 'mongodb://localhost:27017/schoolboard';
  MongoClient.connect(url, function (err, db) { // Connect to the server
    if (err) {
      console.log('Unable to connect to the Server:', err);
    } else {
      console.log('Connected to Server');
      var collection = db.collection('schools'); // Get the documents collection
      var data = {
        'name': req.body.School
      };
      var post1 = {
        $push: {
          needsApproval: {
            "title": req.body.Title,
            "author": req.body.author,
            "content": req.body.content
          }
        }
      };
      collection.update(data, post1, function (err, result) { // Updates the student data
        if (err) {
          console.log(err);
        } else {
          console.log('posted data to document')
          res.redirect("/myaccount/ambassador"); // Redirect to your account
        }
      });
    }
  });
});

//rep approve post


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

//500
app.use(function (err, req, res, next) {
  console.error(err.stack);
  res.status(500);
  // Point at the 500.handlebars view
  res.render('500');
});

//Dynamicizes the webpage
app.listen(app.get('port'), function () {
  console.log('Express started on http://localhost:' +
    app.get('port') + '; press Ctrl-C to terminate');
});

module.exports = router;