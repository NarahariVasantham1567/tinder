const express = require('express');

const app = express();

app.get('/getUserData', (req, res) => {
  throw new Error('some error');
  res.send('User Data Sent');
});

app.use('/', (err, req, res, next) => {
  if (err) {
    res.status(500).send('something went wrong');
  }
});

app.listen(3005, () => {
  console.log('Server is successfully running on port: 3005');
});
