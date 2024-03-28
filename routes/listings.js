const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const { isLoggedIn, isOwner, validateListings } = require("../middleware.js");




//Index routes
router.get("/", wrapAsync(async (req, res) => {
  let allListings = await Listing.find({});
  res.render("listings/index.ejs", { allListings });
}));

//New Route
router.get("/new", isLoggedIn, (req, res) => {

  res.render("listings/new.ejs");
})


//Show Route
router.get("/:id", wrapAsync(async (req, res) => {
  let { id } = req.params;
  let list = await Listing.findById(id)
    .populate({ path: "reviews", populate: { path: "author" }, })
    .populate("owner"); //populate to get reviews
  if (!list) {
    req.flash("error", "Listing not found");
    res.redirect("/listings");
  }
  res.render("listings/show.ejs", { list });
}));


//Create Route
router.post("/", isLoggedIn, validateListings, wrapAsync(async (req, res, next) => {
  const newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id;
  await newListing.save();
  req.flash('success', "Listing saved successfully");
  //Redirect to the index page 
  res.redirect("/listings");
})
);


//Edit route
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(async (req, res) => {
  let { id } = req.params;
  let list = await Listing.findById(id);
  if (!list) {
    req.flash("error", "Listing not found");
    res.redirect("/listings");
  }
  res.render("listings/edit.ejs", { list });
}));


//Update route 
router.patch("/:id", isLoggedIn, isOwner, validateListings, wrapAsync(async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  req.flash('success', 'Listing Uodated Successfully');
  res.redirect(`/listings/${id}`);
}));

//delete route 
router.delete("/:id", isLoggedIn, isOwner, wrapAsync(async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndDelete(id);
  req.flash('success', "Listing deleted successfully");
  res.redirect('/listings');
}));



module.exports = router;