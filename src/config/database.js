const mongoose = require("mongoose");

//connect to the database

const connectDB = async () => {
  return await mongoose.connect(
    "mongodb+srv://1993lavirastogi:lavirastogi@techdevguru.ftsfj.mongodb.net/talentBridge"
  );
};

module.exports = connectDB;
