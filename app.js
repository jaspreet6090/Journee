const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema, reviewSchema } = require("./schema.js");


const listings = require("./routes/listings.js");
const reviews = require("./routes/reviews.js");

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate)

app.listen(3000, () => {
  console.log("Server is running on port 3000");
})

app.get('/', (req, res) => {
  res.send("Server Running");
});

//Database
main().then(() => {
  console.log("Database Connected");
})
  .catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}



//listings
app.use("/listings", listings);

//reviews
app.use("/listings/:id/reviews",reviews);


//all incoming request
app.all("*", (req, res, next) => {

  next(new ExpressError(404, "Page not found"));
})

//Error handlers
app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Something Went Wrong" } = err;
  console.log(message);
  res.render("error.ejs", { message })
  // res.status(statusCode).send(message);
  // res.send("Something went wromg")
});

