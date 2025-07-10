const mongoose = require('mongoose');

const URL =
  'mongodb+srv://narahari:hari1567@namastenode.e4nsd6c.mongodb.net/tinder';

const connectDB = async () => {
  await mongoose.connect(URL);
};

module.exports = connectDB;
