const express = require('express');

const app = express();

app.get('/user', (req, res) => {
  res.send({ firstName: 'Akshay', lastName: 'Saini' });
});

app.post('/user', (req, res) => {
  res.send('Data successfully send to the database!');
});

app.delete('/user', (req, res) => {
  res.send('Deleted successfully');
});

app.get('/test', (req, res) => {
  res.send('Hello from the server!');
});

app.listen(3005, () => {
  console.log('Server is successfully running on port: 3005');
});
