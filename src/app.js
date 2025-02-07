const express = require('express');
require('./config/database');
const app = express();
const connectDB = require('./config/database');
const User = require('./models/user');
const validateSignUpData =require("./utils/validation")
const bcrypt=require("bcrypt");

app.use(express.json());

////signup------------------------
app.post('/signup', async (req, res) => {
  try {
    //validation of data------------
    validateSignUpData(req);
    const { firstName, lastName, emailId, password} = req.body;

    //encrypt password----------
    const passwordHash= await bcrypt.hash(password,10)
    const user = new User({
      firstName,
      lastName,
      emailId,
      password:passwordHash,
      
    });
    await user.save();

    res.status(200).json({ message: 'user added successfully', User });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

///get user data------------------
app.get('/userData', async (req, res, next) => {
  const userEmail = req.body.emailId;
  try {
    const user = await User.find({ emailId: userEmail });
    if (user.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(400).send('not found');
  }
});

///delete user---
app.delete('/userData', async (req, res, next) => {
  const userId = req.body.userId;
  try {
    const user = await User.findByIdAndDelete(userId);
    res.send('user deleted successfully');
  } catch (error) {
    res.status(400).send('not found');
  }
});

//feed api-get all users from db-----
app.get('/feed', async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (error) {
    res.status(400).send('something went wrong');
  }
});

////update-----------------
app.patch('/userData/:userId', async (req, res, next) => {
  const userId = req.params?.userId;
  const data = req.body;
  
  try {
    ///all0wed changes----------------
    const ALLOWED_UPDATES = ['photoUrl', 'about', 'gender', 'age', 'skills'];

    const isUpdateAllowed = Object.keys(data).every((x) =>
      ALLOWED_UPDATES.includes(x)
    );
    if (!isUpdateAllowed) {
      throw new Error (' update are not allowed');
    }
    if(data?.skills.length>4){
      throw new Error( "skills can not be more than 4")
    }

    const user = await User.findByIdAndUpdate({ _id: userId }, data, {
      returnDocument: 'after',
      runValidators: true,
    });
    res.send('user updated  successfully');
  } catch (error) {
    res.status(400).send('update failed' + error.message);
  }
});

////connection--------------------------
connectDB()
  .then(() => {
    console.log('Database connenct successfully...!');
    app.listen(3000, () => {
      console.log('server is listening');
    });
  })
  .catch((err) => {
    console.log('database connection failed');
    console.log(err);
  });
