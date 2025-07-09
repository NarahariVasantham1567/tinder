const express = require('express');

const app = express();

app.get('/user', (req, res) => {
  res.send({ firstName: 'Akshay', lastName: 'Saini' });
});

app.listen(3005, () => {
  console.log('Server is successfully running on port: 3005');
});
