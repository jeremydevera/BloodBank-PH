var mongoose = require('mongoose'); // Import Mongoose Package
var Schema = mongoose.Schema; // Assign Mongoose Schema function to variable
var bcrypt = require('bcrypt-nodejs'); // Import Bcrypt Package
var titlize = require('mongoose-title-case'); // Import Mongoose Title Case Plugin
var validate = require('mongoose-validator'); // Import Mongoose Validator Plugin
// User Mongoose Schema
var BlooddonationSchema = new Schema({
    donation_no: { type: String, required: false,default:'none' },
	donors_name: { type: String, required: false ,default:'none'},
    date: { type: String, required: false ,default:'none'},
    time: { type: String, required: false,default:'none' },
    blood_group: { type: String, required: false,default:'none' },
    no_of_bags_donated: { type: String, required: false,default:'none' },
    volume: { type: String, required: false,default:'none' },
    blood_product_donated: { type: String, required: false,default:'none' },
    branch: { type: String, required: false,default:'none' },
    deferral_type: { type: String, required: false , default:'none'},
    deferral_date: { type: String, required: false,default:'none' },

});

// Middleware to ensure password is encrypted before saving user to database
BlooddonationSchema.pre('save', function(next) {
    var blooddonation = this;
    next(); // Exit Bcrypt function
});
module.exports = mongoose.model('Blooddonation', BlooddonationSchema); // Export User Model for us in API
