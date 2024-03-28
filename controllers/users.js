const User = require("../models/user.js");

module.exports.signupForm = async (req, res) => {
  res.render("users/signup.ejs");
}

module.exports.signupSubmit = async (req, res) => {
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
}

module.exports.loginForm = async (req, res) => {
  res.render("users/login.ejs");
}

module.exports.loginSubmit = async (req, res) => {
  req.flash("success", "Welcome Back!");
  let redirectUrl = res.locals.redirectUrl;
  if (redirectUrl) {
    res.redirect(redirectUrl);
  } else {
    res.redirect("/listings");
  }
}

module.exports.logout = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.flash("success", "Logout Success!");
    res.redirect("/listings");
  });
}