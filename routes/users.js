const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const User = require("../models/user.js");
const passport = require("passport");
// const { userSchema } = require("../schema.js");


//SIGNUP ROUTES
router.get("/signup", wrapAsync(async (req, res) => {
  res.render("users/signup.ejs");
}))

router.post("/signup", wrapAsync(async (req, res) => {
  try {
    let { username, email, password } = req.body;
    const newUser = new User({ email, username });
    const registeredUser = await User.register(newUser, password);
    req.flash("success", "Welcome to Wanderlust!");
    res.redirect("/listings");

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
            passport.authenticate("local", { failureFlash: true, failureRedirect: "/login" }),
            wrapAsync(async (req, res) => {
             req.flash("success", "Welcome Back!");              
             res.redirect("/listings");

}));


module.exports = router;