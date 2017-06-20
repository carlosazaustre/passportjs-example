var express = require('express'); // Express: Framework HTTP
// Routes
var routes = require('./server/routes'); 
var authRoutes = require('./server/auth');
var path = require('path');

var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var session = require('express-session')

var mongoose = require('mongoose'); // Mongoose: MongoDB
var passport = require('passport'); // Passport: Auth Middleware

// user model and passport conf
require('./data/user');
require('./server/passport')(passport);

// Connect with MongoDB
mongoose.connect('mongodb://localhost:27017/passport-example', function(err, res) {
  if(err) throw err;
  console.log('Conectado con éxito a la BD');
});

// Init express app
var app = express();

// Conf
app.set('port', process.env.PORT || 5000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(methodOverride());

// Middlewares HTTP (GET, POST, PUT, DELETE)
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Static route
app.use(express.static(path.join(__dirname, 'public')));
// Session handler
app.use(session({ 
  secret: 'keyboard cat', 
  cookie: { maxAge: 60000 }, 
  resave: true, 
  saveUninitialized: true 
}))

// Passport to control on the session
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.get('/', routes.index);
authRoutes(app, passport);

// Init
app.listen(app.get('port'), function(){
  console.log('Express app listening on port ' + app.get('port'));
});
