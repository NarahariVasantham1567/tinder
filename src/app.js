const express = require('express');
const connectDB = require('./config/database');
const app = express();
const User = require('./models/user');
const { validateSignUpData } = require('./utils/validation');
const bcrypt = require('bcrypt');

app.use(express.json());

app.post('/signup', async (req, res) => {
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
    await user.save();
    res.send('User added successfully');
  } catch (err) {
    res.status(400).send('ERROR : ' + err.message);
  }
});

app.post('/login', async (req, res) => {
  try {
    const { emailId, password } = req.body;

    const user = await User.findOne({ emailId: emailId });

    if (!user) {
      throw new Error('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (isPasswordValid) {
      res.send('Login successfull');
    } else {
      throw new Error('Invalid credentials');
    }
  } catch (err) {
    res.status(400).send('Something went wrong!');
  }
});

app.get('/user', async (req, res) => {
  try {
    const users = await User.find({ emailId: req.body.emailId });

    if (users.length === 0) {
      res.status(404).send('User not found');
    }

    res.send(users);
  } catch (err) {
    res.status(400).send('Something went wrong');
  }
});

app.get('/feed', async (req, res) => {
  try {
    const users = await User.find({});
    if (!users) {
      res.status(404).send('Error getting Users');
    }
    res.send(users);
  } catch (err) {
    res.status(400).send('Something went wrong');
  }
});

app.delete('/user', async (req, res) => {
  const userId = req.body.userId;
  try {
    const user = await User.findByIdAndDelete(userId);
    if (!user) {
      res.status(404).send('User not found');
    }
    res.send(`User with ID: ${userId} deleted successfully!`);
  } catch (err) {
    res.status(400).send('Something went wrong!');
  }
});

app.patch('/user:userId', async (req, res) => {
  const userId = req.params.userId;
  const data = req.body;

  const ALLOWED_UPDATES = ['photoUrl', 'about', 'gender', 'age', 'skills'];

  try {
    const isUpdateAllowed = Object.keys(data).every((k) =>
      ALLOWED_UPDATES.includes(k)
    );

    if (!isUpdateAllowed) {
      throw new Error('Update not allowed');
    }

    if (data?.skills.length > 10) {
      throw new Error('Skills cannot be more than 10');
    }

    const user = await User.findByIdAndUpdate({ _id: userId }, data, {
      runValidators: true,
    });
    if (!user) {
      res.status(404).send('User not found');
    }
    res.send('User updated successfully');
  } catch (err) {
    res.status(400).send('Something went wrong');
  }
});

connectDB()
  .then(() => {
    console.log('Database Connected Successfully!');
    app.listen(3005, () => {
      console.log('Server is successfully running on port: 3005');
    });
  })
  .catch((err) => console.error('Database cannot be connected'));
