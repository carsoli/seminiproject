const express = require('express');
const router = express.Router();

//const flash = require('connect-flash');
var passport = require('passport');

/* import the models we created and defined the schema for */
var student = require('./models/student');
//var client = require('./models/client');
var configDB = require('../config/database.js');
var userglobal = undefined;

//main route
  router.get('/', function(req, res) {
    res.sendfile('./views/home.html');
  });

//Authentication routes
// router.post('/userlogin',
//   passport.authenticate('local'),
//   function(req, res) {
//     // If this function gets called, authentication was successful.
//     // `req.user` contains the authenticated user.
//     res.redirect('/profile/' + req.user.username);
//   });

router.post('/userlogin', passport.authenticate('loginS', {
        session:true,
       //successRedirect: '/profile',
       failureRedirect: '/',
       failureFlash: true
     }),
      function(req, res)
     {
       console.log(req.isAuthenticated());
    //   console.log(''+ req.user);
    //   userglobal = req.user;
       res.redirect('/profile');
      //    console.log(''+ userglobal);
     }
  );

router.post('/studentsignup', (req,res, next)=>{
        var newStudent = new student();
                newStudent.username = req.body.username;
                newStudent.password = req.body.password;
                newStudent.major = req.body.major;
                newStudent.gender = req.body.gender;
                newStudent.name.first = req.body.fnameS;
                newStudent.name.last = req.body.lnameS;
       // console.log(newStudent.username+ " ", newStudent.password);
        student.addStudent(newStudent, (err,user)=>
        {
          if(err) {
            console.log("error registerating :"+ err.message);
           throw err;
          }
          if(!user)
          res.json({success: false, message:"no student was retrieved"});
          else
          {
            req.logIn(user, function(err){
              if(err) return next(err);
              res.redirect('/profile');})

          }
        })

  });

//fronted routes=======================================
// test authenticate
  // router.get('*', (req,res,next) =>{
  //    console.log(isLoggedIn(req, res, next));
  // });


//loads profile -----
 router.get('/profile', function(req, res) {
     console.log("el user el hawdeeh l profile :" + req.user);
      res.render('profile.ejs', {user: req.user});// get the user out of session and pass to template

  });

//logout -----
// router.get('/logout', function(req, res) {
//   req.logout();
//   res.redirect('/');
// });

//isloggedIn
 function isLoggedIn(req, res, next) {
     // if user is authenticated in the session, carry on
     if (req.isAuthenticated()){
          console.log("you're authenticated");
          return next();
        }
     // if they aren't redirect them to the home page
     else {
            console.log("you're NOT authenticated, Redirecting to Home Page");
            res.redirect('/');
          }
 }

module.exports = router;
