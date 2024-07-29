const mongoose = require('mongoose');

const connectDB = async (URI) => {
  try {
    await mongoose.connect(URI);
    return true;
  } catch (error) {
    console.error('Error connecting to MongoDB:', error.message);
    return false;
  }
};

module.exports = connectDB;
