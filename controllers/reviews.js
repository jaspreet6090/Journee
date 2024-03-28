const Listing = require("../models/listing.js");
const Review = require("../models/review.js");

module.exports.submitReview = async (req, res) => {
  let listing = await Listing.findById(req.params.id);
  let newReview = new Review(req.body.review);
  newReview.author = req.user._id;
  listing.reviews.push(newReview);
  await newReview.save();
  await listing.save();
  console.log("submitted")
  req.flash('success', 'Your review has been submitted');
  res.redirect(`/listings/${req.params.id}`);
}

module.exports.deleteReview = async (req, res) => {
  let { id, reviewid } = req.params;
  await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewid } });
  await Review.findByIdAndDelete(reviewid);
  req.flash("success", "Review deleted successfully");
  res.redirect(`/listings/${id}`);
}