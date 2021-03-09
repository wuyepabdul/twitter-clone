const asyncHandler = require("express-async-handler");
const Tweet = require("../Models/TweetModel");

// @desc create new tweet
// @route post /api/tweet
// @access Private
module.exports.createTweetController = async (req, res) => {
  try {
    const { tweet } = req.body;
    const newTweet = new Tweet({
      tweet,
      tweetBy: req.user,
    });
    await newTweet.save();
    res.json(newTweet);
  } catch (error) {
    console.log("createTweetController Error", error.message);
    res.status(500).json({ message: "Server error, try again later" });
  }
};

// @desc GET all tweets
// @route get /api/tweet
// @access Private

module.exports.getAllTweetController = asyncHandler(async (req, res) => {
  try {
    const allTweets = await Tweet.find().populate(
      "tweetBy",
      "_id username email"
    );
    if (allTweets) {
      res.json(allTweets);
    } else {
      res.status(404).json({ message: "No tweets found at this time" });
    }
  } catch (error) {
    console.log("getAllTweetController Error", error.message);
    res.status(500).json({ message: "Server error, try again later" });
  }
});

// @desc GET subscribed tweets
// @route GET /api/tweet/subscribedTweets
// @access Private

module.exports.getSubscribedTweetsController = asyncHandler(
  async (req, res) => {
    try {
      // check for tweetBy(tweet creator) in loggedIn User's following list
      const subscribedTweets = await Tweet.find({
        tweetBy: { $in: req.user.following },
      }).populate("tweetBy", "_id username email");
      if (subscribedTweets) {
        res.json(subscribedTweets);
      } else {
        res.status(404).json({ message: "No tweets found" });
      }
    } catch (error) {
      console.log("getSubscribedTweetsController Error", error.message);
      res.status(500).json({ message: "Server error, try again later" });
    }
  }
);

// @desc GET all my tweets
// @route get /api/tweet/myTweets
// @access Private
module.exports.getMyTweetsController = asyncHandler(async (req, res) => {
  try {
    const myTweets = await Tweet.find({ tweetBy: req.user._id }).populate(
      "tweetBy",
      "_id username email"
    );
    if (myTweets) {
      res.json(myTweets);
    } else {
      res
        .status(404)
        .json({ message: "You have no tweets, please create your tweets" });
    }
  } catch (error) {
    console.log("getAllMyTweetsController Error,", error.message);
    res.status(500).json({ message: "Server error, try again later" });
  }
});

// @desc like a tweet
// @route PUT /api/tweet/like
// @access Private
module.exports.likeTweetController = asyncHandler(async (req, res) => {
  try {
    const { tweetId } = req.body;

    Tweet.findByIdAndUpdate(
      tweetId,
      {
        $push: { likes: req.user.id },
      },
      { new: true }
    ).exec((err, result) => {
      if (err) {
        res.status(422).json({ message: err });
      } else {
        res.json(result);
      }
    });
  } catch (error) {
    console.log("likeTweetController Error", error.message);
  }
});

// @desc unlike a tweet
// @route PUT /api/tweet/like
// @access Private
module.exports.unlikeTweetController = asyncHandler(async (req, res) => {
  try {
    const { tweetId } = req.body;
    Tweet.findByIdAndUpdate(
      tweetId,
      {
        $pull: { likes: req.user.id },
      },
      { new: true }
    ).exec((err, result) => {
      if (err) {
        res
          .status(422)
          .json({ message: err && err.message ? err.message : err });
      } else {
        res.json(result);
      }
    });
  } catch (error) {
    console.log("unlikeTweetController Error", error.message);
  }
});

// @desc create a tweet comment
// @route PUT /api/tweet/comment
// @access Private
module.exports.tweetCommentController = asyncHandler(async (req, res) => {
  try {
    const comment = { text: req.body.text, commentBy: req.user._id };
    Tweet.findByIdAndUpdate(
      tweetId,
      {
        $push: { comments: comment },
      },
      { new: true }
    )
      .populate("comments.commentBy", "_id username")
      .exec((err, result) => {
        if (err) {
          res
            .status(422)
            .json({ message: err && err.message ? err.message : err });
        } else {
          res.json(result);
        }
      });
  } catch (error) {
    console.log("tweetCommentController Error-", error.message);
  }
});

// @desc delete a tweet
// @route DELETE /api/tweet/delete
// @access Private

module.exports.deleteTweetController = asyncHandler(async (req, res) => {
  try {
    const tweet = await Tweet.findById(req.params.tweetId);
    if (tweet) {
      await tweet.remove();
      res.json({ message: "Tweet deleted" });
    } else {
      res.status(404).json({ message: "Tweet not found" });
    }
  } catch (error) {
    console.log("deleteTweetController Error", error.message);
    res.status(500).json({ message: "Server error, try again later" });
  }
});
