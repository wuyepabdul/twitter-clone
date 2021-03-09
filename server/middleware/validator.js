const { check, validationResult } = require("express-validator");

// validate signup data
module.exports.signupValidator = [
  check("username").not().isEmpty().trim().withMessage("Username is required"),
  check("email")
    .isEmail()
    .normalizeEmail()
    .withMessage("Please provide a valid email"),
  check("password")
    .isLength({ min: 5 })
    .withMessage("Password must be at least 5 characters long"),
];

// validate signin data
module.exports.signinValidator = [
  check("email")
    .isEmail()
    .normalizeEmail()
    .withMessage("Please provide a valid email"),
  check("password")
    .isLength({ min: 5 })
    .withMessage("Password length must be at least 5 characters long"),
];

//validate tweet data
module.exports.createTweetValidator = [
  check("tweet").not().isEmpty().trim().withMessage("Tweet can not be empty"),
];

// check & return error if available
module.exports.validatorResult = (req, res, next) => {
  const result = validationResult(req);
  const hasError = !result.isEmpty();
  if (hasError) {
    const validatorError = result.array()[0].msg;
    return res.status(400).json({ message: validatorError });
  }

  next();
};
