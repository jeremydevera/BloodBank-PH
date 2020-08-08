var mongoose = require('mongoose'); // Import Mongoose Package
var Schema = mongoose.Schema; // Assign Mongoose Schema function to variable
var bcrypt = require('bcrypt-nodejs'); // Import Bcrypt Package
var titlize = require('mongoose-title-case'); // Import Mongoose Title Case Plugin
var validate = require('mongoose-validator'); // Import Mongoose Validator Plugin
// User Mongoose Schema
var NewsfeedSchema = new Schema({
    subject: { type: String, required: false},
    user_id: { type: String, required: true },
    nw_content: { type: String, required: false, lowercase: false},
    posted_by: { type: String, required: false, lowercase: false},
    date_posted: { type: String, required: false}
});

// Middleware to ensure password is encrypted before saving user to database
NewsfeedSchema.pre('save', function(next) {
    var newsfeed = this;
    next(); // Exit Bcrypt function
});
module.exports = mongoose.model('Newsfeed', NewsfeedSchema); // Export User Model for us in API
