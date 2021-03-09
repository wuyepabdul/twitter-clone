const {
  signupController,
  signinController,
  getUserProfileController,
  followUserController,
  unfollowUserController,
} = require("../controllers/authController");
const authenticateJwt = require("../middleware/authenticator");
const {
  signupValidator,
  validatorResult,
  signinValidator,
} = require("../middleware/validator");

const router = require("express").Router();

router.post("/signup", signupValidator, validatorResult, signupController);
router.post("/signin", signinValidator, validatorResult, signinController);
router.get("/userProfile/:userId", authenticateJwt, getUserProfileController);
router.put("/follow", authenticateJwt, followUserController);
router.put("/unfollow", authenticateJwt, unfollowUserController);
module.exports = router;
