const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn, isOwner, validateListings } = require("../middleware.js");
const listingController = require("../controllers/listings.js");



//Index routes
router.get("/", wrapAsync(listingController.index));

//New Route
router.get("/new", isLoggedIn, listingController.new)

//Show Route
router.get("/:id", wrapAsync(listingController.show));

//Create Route
router.post("/", isLoggedIn, validateListings, wrapAsync(listingController.create));

//Edit route
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.edit));

//Update route 
router.patch("/:id", isLoggedIn, isOwner, validateListings, wrapAsync(listingController.update));

//delete route 
router.delete("/:id", isLoggedIn, isOwner, wrapAsync(listingController.delete));

module.exports = router;