const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { listingSchema, reviewSchema } = require("../schema.js");
const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../models/listing.js");



//validation function
const validateListings = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);
  // console.log(result)
  if (error) {
    const errorMessage = error.details.map((detail) => detail.message).join(', ');
    console.log(error)
    throw new ExpressError(400, error);
  } else {
    next();
  }
}

//Index routes
router.get("/", wrapAsync(async (req, res) => {
  let allListings = await Listing.find({});

  res.render("listings/index.ejs", { allListings });
}));

//New Route
router.get("/new", (req, res) => {
  res.render("listings/new.ejs");
})


//Show Route
router.get("/:id", wrapAsync(async (req, res) => {
  let { id } = req.params;

  let list = await Listing.findById(id).populate("reviews"); //populate to get reviews

  res.render("listings/show.ejs", { list });
}));


//Create Route
router.post("/", validateListings, wrapAsync(async (req, res, next) => {
  // if(!req.body.listing){
  //   throw new ExpressError(400,"Send Valid Data")
  // }
  // let result = listingSchema.validate(req.body);
  // // console.log(result)
  // if (result.error) {
  //   throw new ExpressError(400, result.error);
  // }
  const newListing = new Listing(req.body.listing);
  await newListing.save();
  //Redirect to the index page 
  res.redirect("/listings");
})
);


//Edit route
router.get("/:id/edit", wrapAsync(async (req, res) => {

  let { id } = req.params;
  let list = await Listing.findById(id);
  res.render("listings/edit.ejs", { list });
}));


//Update route 

router.patch("/:id", validateListings, wrapAsync(async (req, res) => {
  let { id } = req.params;
  // if (!req.body.listing) {
  //   throw new ExpressError(400, "Send Valid Data")
  // }
  await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  res.redirect(`/listings/${id}`);
}));

//delete route 
router.delete("/:id", wrapAsync(async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndDelete(id);
  res.redirect('/listings');
}));



module.exports = router;