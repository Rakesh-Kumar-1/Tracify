const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({});

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Mongoose is connected');
  } catch (error) {
    console.log('Mongoose connection failed:'); 
  }
};

module.exports = connectDB;