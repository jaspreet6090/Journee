const express = require("express");
const router = express.Router({mergeParams: true});
const wrapAsync = require("../utils/wrapAsync.js");
const {validateReview, isLoggedIn ,isReviewAuthor} = require("../middleware.js");

const reviewController = require("../controllers/reviews.js");

//reviews submit
router.post("/",isLoggedIn, validateReview, wrapAsync(reviewController.submitReview));

//review delete route
router.delete("/:reviewid",isLoggedIn,isReviewAuthor, wrapAsync(reviewController.deleteReview));

module.exports = router;