const {
  getAllTweetController,
  getMyTweetsController,
  createTweetController,
  likeTweetController,
  unlikeTweetController,
  tweetCommentController,
  deleteTweetController,
  getSubscribedTweetsController,
} = require("../controllers/tweetController");
const authenticateJwt = require("../middleware/authenticator");
const {
  createTweetValidator,
  validatorResult,
} = require("../middleware/validator");
const { route } = require("./authRoute");

const router = require("express").Router();

// @desc GET tweets
// @route GET /api/tweet/?
// @access Private
router.get("/", authenticateJwt, getAllTweetController);
router.get("/myTweets", authenticateJwt, getMyTweetsController);
router.get("/subscribedTweets", authenticateJwt, getSubscribedTweetsController);

// @desc create new tweet
// @route POST /api/tweet
// @access Private
router.post("/createTweet", authenticateJwt, createTweetController);

// @desc like a tweet
// @route PUT /api/tweet/?
// @access Private
router.put("/like", authenticateJwt, likeTweetController);
router.put("/unlike", authenticateJwt, unlikeTweetController);
router.put("/comment", authenticateJwt, tweetCommentController);

// @desc like a tweet
// @route PUT /api/tweet/delete/:tweetId
// @access Private
router.delete("/delete/:tweetId", authenticateJwt, deleteTweetController);

module.exports = router;
