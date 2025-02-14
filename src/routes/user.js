const express = require('express');
const userRouter = express.Router();

const { userAuth } = require('../middlewares/auth');
const ConnectionRequest = require('../models/connectionRequest');
const USER_SAFE_DATA = 'firstName lastName photoUrl age gender about skills';

//get all pending request for loggedIn user---------

userRouter.get('/user/requests/received', userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const connectionRequest = await ConnectionRequest.find({
      toUserId: loggedInUser._id,
      status: 'interested',
    }).populate(
      'fromUserId',
      'firstName lastName photoUrl age gender about skills'
    );

    res.json({ mesaage: 'data fetch successfully', data: connectionRequest });
  } catch (error) {
    res.status(400).send('ERROR: ' + error.message);
  }
});

////user connection----------------
userRouter.get('/user/connections', userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const connectionRequests = await ConnectionRequest.find({
      $or: [
        { toUserId: loggedInUser._id, status: 'accepted' },
        { fromUserId: loggedInUser._id, status: 'accepted' },
      ],
    })
      .populate('fromUserId', USER_SAFE_DATA)
      .populate('toUserId', USER_SAFE_DATA);
    const data = connectionRequests.map((row) => {
      if (row.fromUserId._id.toString()===loggedInUser._id.toString()) {
        return row.toUserId;
      }

      return row.fromUserId;
    });

    res.json({ data });
  } catch (error) {
    res.status(400).send('ERROR: ' + error.message);
  }
});

module.exports = userRouter;
