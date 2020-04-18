const express = require("express");
const router = express.Router();

// import controller
const {
  signup,
  accountActivation,
  signin,
  forgotPassword,
  resetPassword,
} = require("../controllers/auth");

// import validators
const {
  userSignupValidator,
  userSignInValidator,
  forgotPasswordValidator,
  resetPasswordValidator,
} = require("../validators/auth");

const { runValidation } = require("../validators"); ///index

// router.get("/signup", signup);
router.post("/signup", userSignupValidator, runValidation, signup);
router.post("/account-activation", accountActivation);
router.post("/signin", userSignInValidator, runValidation, signin);

// forgot reset password
router.put(
  "/forgot-password",
  forgotPasswordValidator,
  runValidation,
  forgotPassword
);
router.put(
  "/reset-password",
  resetPasswordValidator,
  runValidation,
  resetPassword
);

module.exports = router;
