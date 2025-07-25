const express = require('express');
const User = require('../models/user');
const { validateSignUpData } = require('../utils/validation');
const bcrypt = require('bcrypt');

const authRouter = express.Router();

authRouter.post('/signup', async (req, res) => {
  try {
    validateSignUpData(req);
    const { firstName, lastName, emailId, password } = req.body;

    const passwordHash = await bcrypt.hash(password, 10);

    const user = new User({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
    });
    const savedUser = await user.save();

    const token = await savedUser.getJWT();
    res.cookie('token', token);

    res.json({ message: 'User added successfully', data: savedUser });
  } catch (err) {
    res.status(400).send('ERROR : ' + err.message);
  }
});

authRouter.post('/login', async (req, res) => {
  try {
    const { emailId, password } = req.body;
    const user = await User.findOne({ emailId: emailId });

    if (!user) {
      throw new Error('Invalid credentials');
    }

    const isPasswordValid = await user.validatePassword(password);

    if (isPasswordValid) {
      const token = await user.getJWT();
      res.cookie('token', token);
      res.send(user);
    } else {
      throw new Error('Invalid credentials');
    }
  } catch (err) {
    res.status(400).send('Something went wrong!');
  }
});

authRouter.post('/logout', async (req, res) => {
  res.cookie('token', null, {
    expires: new Date(Date.now()),
  });
  res.send('Logged out successfully!');
});

module.exports = authRouter;
