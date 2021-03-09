const mongoose = require("mongoose");
require("dotenv").config();

const dbConnection = () =>
  mongoose.connect(
    process.env.MONGODB_URI,
    {
      useCreateIndex: true,
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    },
    (err) => {
      try {
        if (!err) {
          console.log("Connected to Mongodb");
        }
      } catch (error) {
        console.log(`Error, connecting to Mongodb`);
      }
    }
  );

module.exports = dbConnection;
