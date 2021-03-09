const bcrypt = require("bcryptjs");
const User = require("../Models/UserModel");
const asyncHandler = require("express-async-handler");
const { generateToken } = require("../utils/generateToken");
const Tweet = require("../Models/TweetModel");

/*
 @desc Signup a user
 @route GET /api/user/signup 
@access  Public
*/
module.exports.signupController = asyncHandler(async (req, res) => {
  try {
    const { username, email, password } = req.body;
    //check if email exist
    const userExist = await User.findOne({ email });
    if (userExist) {
      res.status(400).json({ message: "User already exist with this email" });
    }

    //check if username exist
    const usernameExist = await User.findOne({ username });
    if (usernameExist) {
      res.status(400).json({
        message:
          "User already exist with this Username, try a different username",
      });
    }

    // hash user password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    //save user
    const savedUser = await newUser.save();
    if (savedUser) {
      res.status(201).json({
        message: "User created successfully",
        user: { username, email },
      });
    } else {
      res.status(400).json({ message: "Error! Could not create new user" });
    }
  } catch (error) {
    console.log(error.message);
    res
      .status(500)
      .json({ message: `Server error: try again later  ${error.message}` });
  }
});

/*
 @desc Sign in a user
 @route POST /api/user/signin 
@access  Public
*/
module.exports.signinController = asyncHandler(async (req, res) => {
  try {
    const { email, password } = req.body;

    //check if user exist
    const userExist = await User.findOne({ email });
    if (!userExist) {
      res.status(401).json({ message: "Invalid Credentials" });
    }

    const matchedPassword = await bcrypt.compare(password, userExist.password);
    if (!matchedPassword) {
      res.status(401).json({ message: "Invalid Credentials" });
    }

    //assign jwt token and login user
    res.json({
      token: generateToken(userExist._id),
      _id: userExist._id,
      email: userExist.email,
      username: userExist.username,
      followers: userExist.followers,
      following: userExist.following,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error, try again later" });
  }
});

/*
 @desc get profile of other users
 @route GET /api/auth/user 
@access  Private
*/
module.exports.getUserProfileController = asyncHandler(async (req, res) => {
  try {
    // find user with given query ID
    const user = await User.findById(req.params.userId).select("-password");
    if (user) {
      //find user tweets
      const userTweet = await Tweet.find({
        tweetBy: req.params.userId,
      }).populate("tweetBy", "_id username");
      if (userTweet) {
        res.json({ user, tweet: userTweet });
      }
    } else {
      res.status(404).json({ message: "No user Found" });
    }
  } catch (error) {
    console.log("getUserProfileController Error", error.message);
    res.status(500).json({ message: "Server error, try again later" });
  }
});

/*
 @desc follow a user 
 @route PUT/api/auth/user/follow 
@access  Private
*/

module.exports.followUserController = asyncHandler(async (req, res) => {
  try {
    const { followId } = req.body;
    if (followId) {
      // update followed User followers list
      const updateUserFollowers = await User.findByIdAndUpdate(
        followId,
        { $push: { followers: req.user._id } },
        { new: true }
      ).select("-password");
      if (updateUserFollowers) {
        //update loggedIn user following List
        const updateUserFollowing = await User.findByIdAndUpdate(
          req.user._id,
          { $push: { following: req.body.followId } },
          { new: true }
        ).select("-password");
        if (updateUserFollowing) {
          res.json({
            message: "Following request was successful",
            updateUserFollowers,
            updateUserFollowing,
          });
        }
      } else {
        console.log("updateUserFollowing Error");
      }
    } else {
      res.status(422).json({ message: "Could not get user details" });
    }
  } catch (error) {
    console.log("followUserController error", error.message);
    res.status(500).json({ message: "Server error, try again later" });
  }
});

/*
 @desc unfollow a user 
 @route PUT/api/auth/user/unfollow 
@access  Private
*/

module.exports.unfollowUserController = asyncHandler(async (req, res) => {
  try {
    const { unfollowId } = req.body;
    if (unfollowId) {
      // update followed User followers list
      const updateUserFollowers = await User.findByIdAndUpdate(
        unfollowId,
        { $pull: { followers: req.user._id } },
        { new: true }
      ).select("-password");
      if (updateUserFollowers) {
        //update loggedIn user following List
        const updateUserFollowing = await User.findByIdAndUpdate(
          req.user._id,
          { $pull: { following: req.body.followId } },
          { new: true }
        ).select("-password");
        if (updateUserFollowing) {
          res.json({ message: "unfollowing request was successful" });
        }
      } else {
        console.log("updateUserFollowing Error");
      }
    } else {
      res.status(422).json({ message: "Could not get user details" });
    }
  } catch (error) {
    console.log("unfollowUserController error", error.message);
    res.status(500).json({ message: "Server error, try again later" });
  }
});
