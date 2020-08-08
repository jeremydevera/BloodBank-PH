var mongoose = require('mongoose'); // Import Mongoose Package
var Schema = mongoose.Schema; // Assign Mongoose Schema function to variable
var bcrypt = require('bcrypt-nodejs'); // Import Bcrypt Package
var titlize = require('mongoose-title-case'); // Import Mongoose Title Case Plugin
var validate = require('mongoose-validator'); // Import Mongoose Validator Plugin
// User Mongoose Schema
var BloodrequestSchema = new Schema({
    patient_name: { type: String, lowercase: true,required: false,default:null },
    blood_group: { type: String, required: false,default:null  },
    blood_needed: { type: String, required: false,default:null  },
    volume: { type: String, required: false,default:null  },
    no_of_bags: { type: String, required: false,default:null  },
    history: { type: String, required: false ,default:null },
    date_needed: { type: String, required: false,default:null  },
    date_requested: { type: String, required: false,default:null  },
    date_claimed: { type: String, required: false,default:null  },
    branch: { type: String, required: false ,default:null },
    request_status: { type: String, required: false ,default:null },
    person_claimed: { type: String, required: false ,default:null },
    remarks: { type: String, required: false ,default:null },
    remarksapproved: { type: String, required: false ,default:null },
    receipt_no: { type: String, required: false ,default:null },
});

// Middleware to ensure password is encrypted before saving user to database
BloodrequestSchema.pre('save', function(next) {
    var bloodrequest = this;
    next(); // Exit Bcrypt function
});
module.exports = mongoose.model('Bloodrequest', BloodrequestSchema); // Export User Model for us in API
