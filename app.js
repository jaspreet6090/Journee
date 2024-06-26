if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const ExpressError = require("./utils/ExpressError.js");
const session = require('express-session');
const flash = require("connect-flash");
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require("./models/user.js");
const MongoStore =  require("connect-mongo");


const listingRouter = require("./routes/listings.js");
const reviewRouter = require("./routes/reviews.js");
const userRouter = require("./routes/users.js");

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate)

//Database
const atlasDb_Url = process.env.MONGODB_ATLAS_URL;

main().then(() => {
  console.log("Database Connected");
})
  .catch(err => console.log(err));


async function main() {
  await mongoose.connect(atlasDb_Url);
}




const store = MongoStore.create({
  mongoUrl: atlasDb_Url,
  crypto : {
    secret: process.env.SECRET,
  },
  touchAfter: 24 * 60 * 60,// 1 day 
})

store.on("error", function(e) {
  console.log("SESSION STORE ERROR", e)
})

const sessionOptions = {
  store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7, // 1 week
    maxAge: 1000 * 60 * 60 * 24 * 7,
    httpOnly: true,
  }
}
app.get('/', (req, res) => {
  res.redirect("/listings");
});


app.listen(3000, () => {
  console.log("Server is running on port 3000");
})



app.use(session(sessionOptions));
app.use(flash());


//passport

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());




//local defining middleware
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currentUser = req.user;
  next();
})



//listings
app.use("/listings", listingRouter);
//reviews
app.use("/listings/:id/reviews", reviewRouter);
//users
app.use("/", userRouter);



//all incoming request
app.all("*", (req, res, next) => {
  next(new ExpressError(404, "Page not found"));
})

//Error handlers
app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Something Went Wrong" } = err;
  // console.log(message);
  res.render("error.ejs", { message })
  // res.status(statusCode).send(message);
  // res.send("Something went wromg")
});
