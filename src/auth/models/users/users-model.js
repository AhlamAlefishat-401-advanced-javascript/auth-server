'use strict';
require('dotenv').config();
const schema= require('./users-schema.js');
const Model = require('../mongo.js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const SECRET = process.env.SECRET || 'mysecret';

let roles = {
  user: ['read'],
  editor: ['read', 'update', 'create'],
  admin: ['read', 'update', 'create', 'delete'],
};
class Users extends Model {
  constructor(){
    super(schema);
  }
  async save(record){
    const db = await this.get ({username : record.username});
    if (db.length == 0) {
      record.password = await bcrypt.hash(record.password, 5);
      const user = await this.create(record);
      return user;
    }
    // return Promise.reject(); // ==>.catch
  }
  // user:pass
  //signin
  async authenticateBasic(user , pass){
    const db = await this.get({username : user});
    const valid = await bcrypt.compare(pass,db[0].password);
    return valid ? db : Promise.reject('wrong password');
  }
  //signin/signup
  generateToken(user){
    const token = jwt.sign({ username :user.username,
      capabilities: roles[user.role],
    }, SECRET);
    return token;
  }
}
Users.verifyToken = function (token) {
  return jwt.verify(token, SECRET, function(err, decoded) {
    if (err) {
      console.log('err>>> ', err);
      return Promise.reject(err);
    }
    console.log('decoded >>>> ',decoded); // {username: usernameValue, ...}
    let username = decoded['username']; // decoded.username
    if (db[username]) {
      return Promise.resolve(decoded);
    } 
    return Promise.reject();
  });
};
module.exports = new Users();