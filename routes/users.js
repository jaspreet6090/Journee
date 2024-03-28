const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { savedRedirectUrl } = require("../middleware.js")

const userController = require("../controllers/users.js");

//SIGNUP ROUTES
router.get("/signup", wrapAsync(userController.signupForm)); //render sign up form

router.post("/signup", wrapAsync(userController.signupSubmit));


//LOGIN ROUTES
router.get("/login", wrapAsync(userController.loginForm));

router.post("/login",
  savedRedirectUrl, //save the redirect url before login so we
  passport.authenticate("local", { failureFlash: true, failureRedirect: "/login" }),
  wrapAsync(userController.loginSubmit));


//LOGOUT ROUTES
router.get("/logout", userController.logout);

module.exports = router;