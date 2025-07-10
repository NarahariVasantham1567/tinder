const express = require('express');
const connectDB = require('./config/database');
const app = express();
const User = require('./models/user');

app.use(express.json());

app.post('/signup', async (req, res) => {
  const user = new User(req.body);

  try {
    await user.save();
    res.send('User added successfully');
  } catch (err) {
    res.status(400).send('Error saving the user: ' + err.message);
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
