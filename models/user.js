const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true
  }
});

// Plugin passport-local-mongoose and define options
userSchema.plugin(passportLocalMongoose, {
  usernameField: 'username', // Specify the field to use as the username
  usernameUnique: true // Ensure uniqueness of the username field
});

module.exports = mongoose.model("User", userSchema);
