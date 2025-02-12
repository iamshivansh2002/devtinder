const express = require('express');
require('./config/database');
const app = express();
const connectDB = require('./config/database');

const cookieParser = require('cookie-parser');


app.use(express.json());
app.use(cookieParser());

const {authRouter}=require("./routes/auth");
const{profileRouter}=require("./routes/profile");
const{requestRouter}=require("./routes/requests");

app.use('/',authRouter);
app.use('/',profileRouter);
app.use('/',requestRouter);


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
