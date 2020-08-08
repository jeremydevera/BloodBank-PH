var mongoose = require('mongoose'); // Import Mongoose Package
var Schema = mongoose.Schema; // Assign Mongoose Schema function to variable
var bcrypt = require('bcrypt-nodejs'); // Import Bcrypt Package
var titlize = require('mongoose-title-case'); // Import Mongoose Title Case Plugin
var validate = require('mongoose-validator'); // Import Mongoose Validator Plugin
// User Mongoose Schema
var BloodnoticeSchema = new Schema({
    serial_code: { type: String, default:'none' },
	message: { type: String, default:'none'},
    user_id: { type: String, default:'none'},
    branch: { type: String, default:'none'},
});

// Middleware to ensure password is encrypted before saving user to database
BloodnoticeSchema.pre('save', function(next) {
    var bloodnotice = this;
    next(); // Exit Bcrypt function
});
module.exports = mongoose.model('Bloodnotice', BloodnoticeSchema); // Export User Model for us in API
