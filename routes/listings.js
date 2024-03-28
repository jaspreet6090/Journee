const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn, isOwner, validateListings } = require("../middleware.js");
const listingController = require("../controllers/listings.js");
const multer = require('multer');
const { storage } = require("../cloudConfig.js");
const  upload  = multer({storage});


router.route("/")
  //Index routes
  .get(wrapAsync(listingController.index))
  //Create Route
  .post(isLoggedIn, upload.single("listing[image]"), validateListings, wrapAsync(listingController.create));
  

//New Route
router.get("/new", isLoggedIn, listingController.new)

router.route("/:id")
  //Show Route
  .get(wrapAsync(listingController.show))
  //Update Route
  .patch(isLoggedIn, isOwner, upload.single("listing[image]"), validateListings, wrapAsync(listingController.update))
  //Delete Route 
  .delete(isLoggedIn, isOwner, wrapAsync(listingController.delete));

//Edit route
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.edit));

module.exports = router;