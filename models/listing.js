const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Review = require("./review")

const listingSchema = new mongoose.Schema({
  title: {
    type:String,
    required:true,
  },
  description: String,
  image: {
    type: String,
    default : "https://images.pexels.com/photos/161758/governor-s-mansion-montgomery-alabama-grand-staircase-161758.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    set : (v) => v===""?"https://images.pexels.com/photos/161758/governor-s-mansion-montgomery-alabama-grand-staircase-161758.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" : v,
  },
  price: Number,
  location: String,
  country: String,
  reviews : [
    {
      type : Schema.Types.ObjectId,
      ref: "Review",
    }
  ]

});

listingSchema.post("findOneAndDelete", async (listing) =>{
  if(listing){

    await Review.deleteMany({_id : {$in : listing.reviews}});
  }

})

const Listing = mongoose.model("Listing",listingSchema);

module.exports = Listing;