const express = require('express');


const profileRouter = express.Router();

const { userAuth } = require('../middlewares/auth');
const { validateSignUpData } = require('../utils/validation');
const { validateEditProfileData } = require('../utils/validation');
const User = require('../models/user');

////get----
profileRouter.get('/profile/view', userAuth, async (req, res) => {
  try {
    const user = req.user;

    res.send(user);
  } catch (error) {
    res.status(400).send('Error: ' + error.message);
  }
});

//edit-----
profileRouter.patch('/profile/edit', userAuth, async (req, res) => {
  try {
    if (!validateEditProfileData(req)) {
      throw new Error('invalid edit request');
    }
    const loggedInUser = req.user;

    Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]));
    await loggedInUser.save();

    res.json({
      message:`${loggedInUser.firstName},"profile updated successfully`,
      data:loggedInUser,
    });
  } catch (error) {
    res.status(400).send('ERROR: ' + error.message);
  }
});


//forget password-----
profileRouter.post("/profile/forgetPassword",userAuth,async(req,res)=>{
  try {
    const emailId=req.body;
    const user=User.findOne({emailId});
    if(!user){
      return res.status(400)
    }
  } catch (error) {
    
  }
})
module.exports = { profileRouter };
