'use strict';

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const users = new mongoose.Schema({
  username: {type:String, required:true, unique:true},
  password: {type:String, required:true},
 
});

users.pre('save', async function() {
 
    this.password = await bcrypt.hash(this.password, 5);
  
});



users.methods.authenticateBasic = function(user, pass) {
  let query = {username:user};
  return this.findOne(query)
    .then( user => user && user.comparePassword(pass) )
    .catch(error => {throw error;});
};

users.methods.comparePassword = function(password) {
  return bcrypt.compare( password, this.password )
    .then( valid => valid ? this : null);
};

users.methods.generateToken = function(user) {

 console.log('user : ', user);
 console.log('befor genrate token : ');

  let token = jwt.sign({ username: user.username}, process.env.SECRET);
  console.log('token : ', token);

  return token;
};

users.methods.findUsers = function() {
    return this.find({"username":"obada22"});
  };

users.methods.authenticateToken = async function (token) {
    try {
      let tokenObject = jwt.verify(token, SECRET);
  
      if (db[tokenObject.username]) {
        // Resolve the promise with an object representing the user
        // In this case, just what's in the token, but it could be the whole thing if you choose
        // Note that our middleware needs the role/capabilities
        return Promise.resolve(tokenObject);
      }
      else {
        return Promise.reject();
      }
    } catch (e) { return Promise.reject(); }
  
    // let tokenObject = jwt.verify(token, SECRET);
    // return users[tokenObject.username] ? Promise.resolve(tokenObject) : Promise.reject();
  
  }

module.exports = mongoose.model('users', users);