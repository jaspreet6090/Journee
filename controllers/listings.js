const Listing = require("../models/listing.js");
const maptilerClient = require("@maptiler/client");

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
module.exports.create = async (req, res, ) => {
  let url = req.file.path;
  let filename = req.file.filename;
  let category = req.body.listing.category;
  console.log(category);
  let location = req.body.listing.location;
  maptilerClient.config.apiKey = process.env.MAP_KEY;
  // in an async function, or as a 'thenable':
  const result = await maptilerClient.geocoding.forward(location);
  // console.log(result.features[0].geometry);
  const newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id;
  newListing.image = { url, filename };
  newListing.category = category;
  newListing.geometry = result.features[0].geometry;
    await newListing.save();
  req.flash('success', "Listing saved successfully");
  //Redirect to the index page 
  res.redirect("/listings");
}

// EDIT
module.exports.edit = async (req, res) => {
  let { id } = req.params;
  let list = await Listing.findById(id);
  let originalImageUrl = list.image.url;
  originalImageUrl = originalImageUrl.replace("/upload", "/upload/h_250,w_300");
  if (!list) {
    req.flash("error", "Listing not found");
    res.redirect("/listings");
  }
  res.render("listings/edit.ejs", { list, originalImageUrl });
}

// UPDATE
module.exports.update = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  if (typeof req.file !== 'undefined') {
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = { url, filename };
    await listing.save();
  }
  req.flash('success', 'Listing Updated Successfully');
  res.redirect(`/listings/${id}`);
}

// DELETE
module.exports.delete = async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndDelete(id);
  req.flash('success', "Listing deleted successfully");
  res.redirect('/listings');
}