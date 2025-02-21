const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
  patientID: {
    type: String,
    required: true,
    unique: true,  // Ensures patientID is unique for each patient
    index: true,   // Adds an index for faster lookups (useful for large data)
  },
  name: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    required: true,
  },
  contact: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Other'],  // Restrict to Male, Female, or Other
    required: true,  // Gender is now a required field
  },
  healthComplaints: {
    type: String,
    required: true,
  },
  registrationDate: {
    type: Date,
    default: Date.now,  // Automatically sets the registration date to the current time
  },
  additionalDiseases: {
    type: String,  // Field for recording additional diseases
    default: '',   // Default value is an empty string
  },
  referralDetails: {
    type: String,  // Field for recording referral details
    default: '',   // Default value is an empty string
  },
});


module.exports = mongoose.model('Patient', patientSchema);
