const express = require('express');
const userRouter = express.Router();
const { userAuth } = require('../middlewares/auth');
const ConnectionRequest = require('../models/connectionRequest');
const User = require('../models/user');

userRouter.get('/user/requests/recieved', userAuth, async (req, res) => {
  try {
    const user = req.user;
    const connectionRequest = await ConnectionRequest.find({
      toUserId: user._id,
      status: 'interested',
    }).populate(
      'fromUserId',
      'firstName lastName photoUrl age gender about skills'
    );

    res.json({
      message: 'Data fetched successfully!',
      data: connectionRequest,
    });
  } catch (err) {
    req.statusCode(400).send('ERROR: ' + err.message);
  }
});

userRouter.get('/user/connections', userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const connectionRequest = await ConnectionRequest.find({
      $or: [
        { toUserId: loggedInUser._id, status: 'accepted' },
        { fromUserId: loggedInUser._id, status: 'accepted' },
      ],
    })
      .populate(
        'fromUserId',
        'firstName lastName age gender skills photoUrl about'
      )
      .populate(
        'toUserId',
        'firstName lastName age gender skills photoUrl about'
      );

    const data = connectionRequest.map((row) => {
      if (row.fromUserId._id.toString() === loggedInUser._id.toString()) {
        return row.toUserId;
      }
      return row.fromUserId;
    });

    res.json({
      data: data,
    });
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
});

userRouter.get('/feed', userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    limit = limit > 50 ? 50 : limit;

    const skip = (page - 1) * limit;

    const connectionRequest = await ConnectionRequest.find({
      $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
    }).select('fromUserId toUserId');

    const hideUsersFromFeed = new Set();
    connectionRequest.forEach((req) => {
      hideUsersFromFeed.add(req.fromUserId.toString());
      hideUsersFromFeed.add(req.toUserId.toString());
    });

    const users = await User.find({
      $and: [
        { _id: { $nin: Array.from(hideUsersFromFeed) } },
        { _id: { $ne: loggedInUser._id } },
      ],
    })
      .select('firstName lastName age gender skills photoUrl about')
      .skip(skip)
      .limit(limit);

    res.send(users);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = userRouter;
