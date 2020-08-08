var mongoose = require('mongoose'); // Import Mongoose Package
var Schema = mongoose.Schema; // Assign Mongoose Schema function to variable
var bcrypt = require('bcrypt-nodejs'); // Import Bcrypt Package
var titlize = require('mongoose-title-case'); // Import Mongoose Title Case Plugin
var validate = require('mongoose-validator'); // Import Mongoose Validator Plugin
// User Mongoose Schema
var BloodinventorySchema = new Schema({
    branch: { type: String },
	A_plus: { type: String},
    A_minus: { type: String},
    B_plus: { type: String },
    B_minus: { type: String },
    O_plus: { type: String },
    O_minus: { type: String },
    AB_plus: { type: String },
    AB_minus: { type: String},
});

// Middleware to ensure password is encrypted before saving user to database
BloodinventorySchema.pre('save', function(next) {
    var bloodinventory = this;
    next(); // Exit Bcrypt function
});
module.exports = mongoose.model('Bloodinventory', BloodinventorySchema); // Export User Model for us in API
