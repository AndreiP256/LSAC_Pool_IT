const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect('mongodb+srv://Prusi-admin:Database_pass@lsac-poll-it.g9u2hcc.mongodb.net/poll_it_app');
    console.log("Database Connected");
  } catch (error) {
    console.error("Error connecting to the database:", error);
    process.exit(1); 
  }
};

module.exports = connectDB;