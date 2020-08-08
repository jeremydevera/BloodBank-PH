var mongoose = require('mongoose'); // Import Mongoose Package
var Schema = mongoose.Schema; // Assign Mongoose Schema function to variable
var bcrypt = require('bcrypt-nodejs'); // Import Bcrypt Package
var titlize = require('mongoose-title-case'); // Import Mongoose Title Case Plugin
var validate = require('mongoose-validator'); // Import Mongoose Validator Plugin
// User Mongoose Schema
var BloodbankchapterSchema = new Schema({
    subject: { type: String, lowercase: true, required: false, unique: false,default: 'user'},
    user_id: { type: String, required: true,default: 'user' },
    nw_content: { type: String, required: false, lowercase: false, unique:false,default: 'user'}
});

// Middleware to ensure password is encrypted before saving user to database
BloodbankchapterSchema.pre('save', function(next) {
    var bloodbankchapter = this;

});
module.exports = mongoose.model('Bloodbankchapter', BloodbankchapterSchema); // Export User Model for us in API
