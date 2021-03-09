const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dbConnection = require("./db/dbConfig");
const bodyParser = require("body-parser");
require("dotenv").config();

const authRoutes = require("./routes/authRoute");
const tweetRoutes = require("./routes/tweetRoute");

const app = express();

dbConnection();
// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

app.use("/api/user", authRoutes);
app.use("/api/tweet", tweetRoutes);

//===============================================SERVER CONFIG=========================================================================

app.listen(process.env.PORT || 5000, (err) => {
  try {
    if (!err) {
      console.log(`Server started at port ${process.env.PORT}`);
    }
  } catch (error) {
    console.log(`Error encountered while starting server`, error);
  }
});
