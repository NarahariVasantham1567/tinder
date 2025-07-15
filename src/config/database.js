const mongoose = require('mongoose');

const connectDB = async () => {
  await mongoose.connect(process.env.MONGO_SECRET_KEY);
};

module.exports = connectDB;
