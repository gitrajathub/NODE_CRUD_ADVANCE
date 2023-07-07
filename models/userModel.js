const mongoose = require('mongoose');
const validator = require('validator');
const { boolean } = require('webidl-conversions');


const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: validator.isEmail,
      message: 'Invalid email address'
    }
  },
  password: {
    type: String,
    required: true
  },
  role: { 
    type: String,  
    default: 'user' 
  },
  resetToken:{
    type:String  
  },
  resetTokenExpiration: {
    type: Date  
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
