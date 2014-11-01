var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');

// DB Connection
var pg = require('pg');
var conString = process.env.DATABASE_URL || "postgres://local_admin:1661@localhost:5432/mydb";
var client = new pg.Client(conString);
client.connect();

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('html', require('hogan-express'));
app.set('view engine', 'html');


//app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);

app.get('/userlist', function (request, response) {
    client.query('SELECT * FROM userlist', function(err, result) {
      if (err)
       { console.error(err); response.send("Error " + err); }
      else
       { response.send(result.rows); }
    });
});

app.post ('/adduser', function (request, response) {
    var id = request.body.id;
    var userName = request.body.userName;
    var email = request.body.email;
    var name = request.body.name;
    var age = request.body.age;
    var city = request.body.city;
    var gender = request.body.gender;
     
    client.query ('INSERT into userlist (id, username, email, name, age, city, gender) VALUES ($1, $2, $3, $4, $5, $6, $7)', [id,userName,email,name,age,city,gender] , function (err, result) {
        if (err) {
            response.send(err);
        } else {
             response.send("Row Inserted..");
        }
    }); 
});


/// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
