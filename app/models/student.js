//define a schema then the model then export it
/* Once we define our Mongoose model, it will let us handle creating,
 reading, updating, and deleting our model (CRUD). */
//MongoDB object-modeling tool
var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

//student schema
const studentSchema = mongoose.Schema({
    username : {
                type: String,
                required: [true, 'must specify a username'],
                unique:true },
    password : {
                type: String,
                required: true,
                min: [8,'password must be at least 8 characters long'],
                max: [15, 'password can at most be 15 characters long']
                },
    name:      {
                first: String,
                last: String
                },
    birthdate: {
                  type: Date,
                  default: undefined
                },
    major:    {
                type: String,
                enum: ['BI', 'MET'],
                required: [true, 'please specify your major!']
              },
    gender:   {
                type: String,
                enum: ['F','M']
              },
    work:     {
                screenshots: [],
                repoLinks: [],
                websites: []
              }
    });

/*first argument of the model function is a singular object
 for ex, mongoose will look in the array student"s" since we
 specified student in the model function */
module.exports = mongoose.model('student', studentSchema);

module.exports.getStudentById = function(id, callback) {
    this.findById(id, callback);
 };

module.exports.getStudentByUsername = function(un, callback){
  const query = {username: un};
  this.findOne(query, callback);
}
//===========================================================
//generates hash and saves the hash as the student pw
module.exports.addStudent = function(newStudent, callback) {
  console.log("trying to addStudent");
  bcrypt.genSalt(10, (err,salt) => {
   bcrypt.hash(newStudent.password, salt, null, (err,hash) => 
   {
      if(err) 
        throw err; 
      console.log("no error hashing"); 
      newStudent.password = hash ;
      newStudent.save(callback); 
  }); 
  })
}  
//========================================
 module.exports.comparePassword = function(candidatePassword, hash ,callback){
        bcrypt.compare(candidatePassword, hash,(err,isMatch)=> {
          if(err) 
            throw err; 
          else callback(null, isMatch);
      })    
 };