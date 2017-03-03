//it's similar to localStrategy ; but also has a token (token-based authentication)
const localStrategy = require('passport-local').Strategy;
const student = require('../app/models/student');
const configDB = require('./database');

//this is just what we import in the server
module.exports = function(passport){

// used to serialize the user for the session
passport.serializeUser(function(user, done) {
    done(null, user.id);
});

// used to deserialize the user
passport.deserializeUser(function(user, done) {
    student.getStudentById(user._id, function(err, user) {
        done(err, user);
    });
});

//student login
passport.use('loginS', new localStrategy({
  usernameField: 'username',
  passwordField: 'password',
  passReqToCallback: true
},
  function(req, username, password, done){
    //  console.log("IM HERE");
    //student.getStudentByUsername won't fire unless data is sent back
     process.nextTick(function() {
    //checking to see if the user trying to login already exists
     student.getStudentByUsername(username, function(err, user) {
        if (err)
            return done(err);
        if (!user){
            console.log("user not registered");
            return done(null, false, req.flash('loginMessage', 'Username does not exist'));
            }
        if(!student.comparePassword(password, user.password,(err,isMatch) => {
            if(!isMatch)
              {
                  console.log("wrng pw");
                   return done(null,false, req.flash('loginMessage','Wrong Password!'));
                }
            else
            {
               console.log("logged in");
                return done(null, user);
            }
              }));
          });
        });
      }));

};//end of exported fn's
