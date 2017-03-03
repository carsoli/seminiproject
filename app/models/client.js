var mongoose = require('mongoose');

//define a schema then the model then export it
var clientSchema =mongoose.Schema({
    username : {
                type: String,
                required: [true, 'must specify a username'],
                unique:true },
    password : {
                type: String,
                required: true,
                min: [8,'password must be at least 8 characters long'],
                max: [15, 'password can at most be 21 characters long']
  //  , url: String
                },
    name:       {
                  first: String,
                  last: String
                }
  });

module.exports = mongoose.model('client', clientSchema);
