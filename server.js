//modules =====================================================
var express = require('express'); //framework
var app = express();
//set our port
var port = process.env.PORT || 8080;
var mongoose= require('mongoose');
var passport = require('passport'); //authenticator
var flash = require('connect-flash'); //session flash messages

var morgan = require('morgan'); //logger
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session'); //sessions
var methodOverride = require('method-override');
var path= require('path');

//configuration ===================================================
//config db files
var config = require('./config/database.js');

//connect to our mongoDB database
mongoose.connect(config.database);
//to test that we are connected
mongoose.connection.on('connected', () => {
  console.log('connected to database: ' + config.database);
})
mongoose.connection.on('error', (err) => {
  console.log('Error Connecting to DB: ' + err.message);
})
//config passport
require('./config/passport.js')(passport);

//set up our app
app.use(morgan('dev')); //logs all requests
//set the static files location; this is the folder that has all the front end files we need; ejs looks for views
app.use(express.static(path.join(__dirname + '/public')));
//parse application/json
app.use(cookieParser());//reads cookies needed for auth
app.use(bodyParser.json());//get info from html forms
app.use(bodyParser.json({type:'application/vnd.api+json'})); //parse application/vnd.api +json as json
app.use(bodyParser.urlencoded({ extended: true})); // parse application/x-www-form-urlencoded
// app.use(methodOverride('X-HTTP-Method-Override')); //override with the X-HTTP-Method-Override header in the request. simulate DELETE/PUT

//passport middleware
app.use(session(
  {
  secret:'shh',
  resave: true,
  saveUninitialized: true,
  cookie: {_expires: 604800 }
  }
));
app.use(passport.initialize());
app.use(passport.session());//persistent login sessions
app.use(flash()); //for flash messages stored in session
app.set('view engine','ejs'); // set up ejs for templating
//routes =================================================
var routes = require('./app/routes.js'); //load our routes and pass in our app and fully configured passport
app.use('/', routes);

//no new line should follow starting the server
//start the app on port and shoutout to the users
app.listen(port,function(){
                  console.log('Server is Running on Port:' + port);
              });

//expose the app
exports = module.exports = app;
