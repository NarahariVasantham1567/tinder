const express = require('express');
const { adminAuth } = require('./middlewares/auth');

const app = express();

app.use('/admin', adminAuth);

app.get('/user', (req, res) => {
  res.send('User data sent!');
});

app.get('/admin/getAllData', (req, res) => {
  res.send('All Data Sent');
});

app.delete('/admin/deleteUser', (req, res) => {
  res.send('Deleted a user');
});

app.listen(3005, () => {
  console.log('Server is successfully running on port: 3005');
});
