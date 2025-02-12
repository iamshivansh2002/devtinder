const express=require("express");
const router=express.Router();
const validateSignUpData = require('../utils/validation');
const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const authRouter=express.Router();

 ////signup----------------------- -
authRouter.post('/signup', async (req, res) => {
    try {
      //validation of data------------
      validateSignUpData(req);
      const { firstName, lastName, emailId, password } = req.body;
  
      //encrypt password----------
      const passwordHash = await bcrypt.hash(password, 10);
      const user = new User({
        firstName,
        lastName,
        emailId,
        password: passwordHash,
      });
      await user.save();
  
      res.status(200).json({ message: 'user added successfully', User });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });


  // login------------------
authRouter.post('/login', async (req, res) => {
  try {
    const { emailId, password } = req.body;

    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      throw new Error('Invalid credentials');
    }

    const isPasswordValid = await user.validatePassword(password);

    if (isPasswordValid) {
      ////create jwt token------
      const token = await user.getJWT();

      //add token to cookie and sent back to user----
      res.cookie('token', token,{ expires: new Date(Date.now() + 900000)});
      res.send('login successfully');
    } else {
      throw new Error('invalid credentials');
    }
  } catch (error) {
    res.status(400).send('Error: ' + error.message);
  }
});



authRouter.post("/logout", async (req, res) => {
  res.cookie("token", "", { 
    httpOnly: true, 
    expires: new Date(0) 
  });
  res.status(200).json({ message: "Logged out successfully" });
});






module.exports={authRouter};