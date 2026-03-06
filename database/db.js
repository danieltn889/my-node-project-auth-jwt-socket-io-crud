const mongoose = require('mongoose');
const PORT = process.env.PORT || 3000;


const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected to Atlas");
  } catch (err) {
    console.log("Connection Error:", err);
    process.exit(1); // Exit the process with an error code
  }
}

module.exports = connectDB;