const express = require("express");
const router = express.Router();

// import controller
const { requireSignin } = require("../controllers/auth");
const { read, update } = require("../controllers/user");

// import validators

router.get("/user/:id", requireSignin, read);
router.put("/user/update", requireSignin, update);

module.exports = router;
