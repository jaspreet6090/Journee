const express = require("express");
const router = express.Router({mergeParams: true});
const Review = require("../models/review.js");
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const {validateReview, isLoggedIn ,isReviewAuthor} = require("../middleware.js");


//reviews submit
router.post("/",isLoggedIn, validateReview, wrapAsync(async (req, res) => {
  let listing = await Listing.findById(req.params.id);
  let newReview = new Review(req.body.review);
  newReview.author = req.user._id;
  listing.reviews.push(newReview);
  await newReview.save();
  await listing.save();
  console.log("submitted")
  req.flash('success', 'Your review has been submitted');
  res.redirect(`/listings/${req.params.id}`);
}));

//review delete route
router.delete("/:reviewid",isLoggedIn,isReviewAuthor, wrapAsync(async (req, res) => {
  let { id, reviewid } = req.params;
  await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewid } });
  await Review.findByIdAndDelete(reviewid);
  req.flash("success", "Review deleted successfully");
  res.redirect(`/listings/${id}`);
}));

module.exports = router;