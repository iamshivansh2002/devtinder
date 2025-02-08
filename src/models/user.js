const mongoose = require('mongoose');
const validator=require("validator");
const jwt=require("jsonwebtoken");
const bcrypt=require("bcrypt");

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    minLength:5,
  },
  lastName: {
    type: String,
  },
  emailId: {
    type: String,
    required: true,
    unique: true,
    lowercase:true,
    trim:true,
    validate(value){
      if(!validator.isEmail(value)){
        throw new Error("invalid email address: "+value);
      }
    }
  },

  password: {
    type: String,
    required: true,
  },

  age: {
    type: Number,
    min:18, 
  },
  gender: {
    type: String,
    validate(value){
      if(!["male","female","others"].includes(value)){
        throw new Error("Gender data is not valid");
      }
        
    },
  },
  photoUrl: {
    type: String,
    default:
      'https://pixabay.com/vectors/blank-profile-picture-mystery-man-973460/',
  },
  about: {
    type: String,
    default: 'This is default about the user!',
  },
  skills: {
    type: [String],
  },
},
{
  timestamps:true,
}
);



userSchema.methods.getJWT = async function () {
  const user = this;
  const token = await jwt.sign({ _id: user._id }, 'sdfgasgj@fhf', {
    expiresIn: '7d',
  });
  return token;
};

userSchema.methods.validatePassword=async function(passwordInputByUser){
  const user=this;
  const passwordHash=user.password;
  const isPasswordValid=await bcrypt.compare(
    passwordInputByUser,
    passwordHash
  );
  return isPasswordValid;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
