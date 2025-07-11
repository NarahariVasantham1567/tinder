const express = require('express');
const { userAuth } = require('../middlewares/auth');
const { validateProfileData } = require('../utils/validation');

const profileRouter = express.Router();

profileRouter.get('/profile/view', userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (err) {
    res.status(400).send('ERROR: ' + err.message);
  }
});

profileRouter.patch('/profile/edit', userAuth, async (req, res) => {
  try {
    if (!validateProfileData(req)) {
      throw new Error('Invalid Edit Request');
    }

    const user = req.user;

    Object.keys(req.body).forEach((key) => (user[key] = req.body[key]));

    await user.save();

    res.json({
      message: `${user.firstName}, your profile updated successfully`,
      data: user,
    });
  } catch (err) {
    res.status(400).send('Something went wrong!');
  }
});

module.exports = profileRouter;
