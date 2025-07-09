const express = require('express');

const app = express();

app.get('/test', (req, res) => {
  res.send('Hello from the server!');
});

app.listen(3005, () => {
  console.log('Server is successfully running on port: 3005');
});
