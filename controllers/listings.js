const Listing = require("../models/listing.js");

//INDEX 
module.exports.index = async (req, res) => {
  let allListings = await Listing.find({});
  res.render("listings/index.ejs", { allListings });
}

//SHOW
module.exports.show = async (req, res) => {
  let { id } = req.params;
  let list = await Listing.findById(id)
    .populate({ path: "reviews", populate: { path: "author" }, })
    .populate("owner"); //populate to get reviews
  if (!list) {
    req.flash("error", "Listing not found");
    res.redirect("/listings");
  }
  res.render("listings/show.ejs", { list });
}

// NEW
module.exports.new = (req, res) => {
  res.render("listings/new.ejs");
}

// CREATE
module.exports.create = async (req, res, next) => {
  const newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id;
  await newListing.save();
  req.flash('success', "Listing saved successfully");
  //Redirect to the index page 
  res.redirect("/listings");
}

// EDIT
module.exports.edit = async (req, res) => {
  let { id } = req.params;
  let list = await Listing.findById(id);
  if (!list) {
    req.flash("error", "Listing not found");
    res.redirect("/listings");
  }
  res.render("listings/edit.ejs", { list });
}

// UPDATE
module.exports.update = async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  req.flash('success', 'Listing Uodated Successfully');
  res.redirect(`/listings/${id}`);
}

// DELETE
module.exports.delete = async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndDelete(id);
  req.flash('success', "Listing deleted successfully");
  res.redirect('/listings');
}