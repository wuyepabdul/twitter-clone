const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const tweetSchema = new mongoose.Schema(
  {
    tweet: { type: String, required: true },
    photo: { type: String, default: "avatar" },
    likes: [{ type: ObjectId, ref: "User" }],
    comments: [{ text: String, commentBy: { type: ObjectId, ref: "User" } }],
    tweetBy: { type: ObjectId, ref: "User" },
  },
  { timestamps: true }
);

const Tweet = mongoose.model("Tweet", tweetSchema);
module.exports = Tweet;
