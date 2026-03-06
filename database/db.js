const mongoose = require('mongoose');
const PORT = process.env.PORT || 3000;


const connectDB = async () => {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/bookStore');
    console.log("MongoDB Connected to bookStore");
  } catch (err) {
    console.log("Connection Error:", err);
    process.exit(1); // Exit the process with an error code
  }
}

module.exports = connectDB;