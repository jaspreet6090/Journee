const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const User = require("../models/user.js");
const passport = require("passport");
const { savedRedirectUrl } = require("../middleware.js")


//SIGNUP ROUTES
router.get("/signup", wrapAsync(async (req, res) => {
  res.render("users/signup.ejs");
}))

router.post("/signup", wrapAsync(async (req, res) => {
  try {
    let { username, email, password } = req.body;
    const newUser = new User({ email, username });
    const registeredUser = await User.register(newUser, password);
    req.login(registeredUser, (err) => {
      if (err) return next(err);
      req.flash("success", "Welcome to Wanderlust!");
      res.redirect("/listings");
    })
  } catch (e) {
    req.flash("error", e.message);
    res.redirect("/signup");
  }
}));


//LOGIN ROUTES
router.get("/login", wrapAsync(async (req, res) => {
  res.render("users/login.ejs");
}));

router.post("/login",
  savedRedirectUrl, //save the redirect url before login so we
  passport.authenticate("local", { failureFlash: true, failureRedirect: "/login" }),
  wrapAsync(async (req, res) => {
    req.flash("success", "Welcome Back!");
    let redirectUrl = res.locals.redirectUrl;
    if (redirectUrl) {
      res.redirect(redirectUrl);
    } else {
      res.redirect("/listings");
    }

  }));


//LOGOUT ROUTES
router.get("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.flash("success", "Logout Success!");
    res.redirect("/listings");
  });
})

module.exports = router;