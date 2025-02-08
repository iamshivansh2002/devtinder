const express = require('express');
require('./config/database');
const app = express();
const connectDB = require('./config/database');
const User = require('./models/user');
const validateSignUpData = require('./utils/validation');
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const{userAuth}=require("./middlewares/auth");

app.use(express.json());
app.use(cookieParser());

////signup----------------------- -
app.post('/signup', async (req, res) => {
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
app.post('/login', async (req, res) => {
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

////get
app.get('/profile',userAuth, async (req, res) => {
  try {
  const user=req.user;
  
    res.send(user);
  } catch (error) {
    res.status(400).send('Error: ' + error.message);
  }
});

///connection request------------------
app.post("/connection",userAuth , async (req,res) =>{
  const user=req.user;
  console.log("sending a connection request")
res.send(user.firstName+ "sent the connection request");
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
