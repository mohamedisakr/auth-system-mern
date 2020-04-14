const express = require("express");
const router = express.Router();

// import controller
const { signup, accountActivation, signin } = require("../controllers/auth");

// import validators
const {
  userSignupValidator,
  userSignInValidator,
} = require("../validators/auth");
const { runValidation } = require("../validators"); ///index

// router.get("/signup", signup);
router.post("/signup", userSignupValidator, runValidation, signup);
router.post("/account-activation", accountActivation);
router.post("/signin", userSignInValidator, runValidation, signin);

module.exports = router;
