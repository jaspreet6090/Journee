const Listing = require("./models/listing");
const Review = require("./models/review");
const { listingSchema , reviewSchema } = require("./schema.js");
const ExpressError = require("./utils/ExpressError.js");

module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.redirectUrl = req.originalUrl;
    req.flash("error", "Please login to create a listing");
    return res.redirect("/login"); // Return the response here to prevent further execution
  }
  next(); // Call next only if the user is authenticated
}


module.exports.savedRedirectUrl = (req, res, next) => {
  if (req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl; // Corrected to res.locals
  }
  next();
}

module.exports.isOwner =async(req, res, next) => {
  let { id } = req.params;
  let listing =  await Listing.findById(id);
  if(!listing.owner.equals(res.locals.currentUser._id)){
    req.flash("error", 'You are not owner of this listing');
   return res.redirect(`/listings/${id}`);
  }
  next();
}

module.exports.isReviewAuthor =async(req, res, next) => {
  let {id, reviewid } = req.params;
  let review =  await Review.findById(reviewid);
  if(!review.author.equals(res.locals.currentUser._id)){
    req.flash("error", 'You are not Author of this review');
   return res.redirect(`/listings/${id}`);
  }
  next();
}
 
//validate listing
module.exports.validateListings = (req, res, next) => {
  const { error } = listingSchema.validate(req.body);
  if (error) {
    const errorMessage = error.details.map((detail) => detail.message).join(', ');
    throw new ExpressError(400, errorMessage); // Pass errorMessage instead of error
  } else {
    next();
  }
}

//validate review
module.exports.validateReview = (req, res, next) => {
  let { error } = reviewSchema.validate(req.body);
  if (error) {
    throw new ExpressError(400, error);
  } else {
    next();
  }
}