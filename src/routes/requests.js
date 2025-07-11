const express = require('express');

const requestRouter = express.Router();

requestRouter.post('/sendConnectionRequest', (req, res) => {
  const user = req.user;
  console.log('Sending a connection request!');

  res.send(user.firstName + 'sent the connect request!');
});

module.exports = requestRouter;
