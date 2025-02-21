const mongoose = require('mongoose');

const userSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ['Admin', 'Clerk', 'Doctor', 'Nurse', 'Paramedic'],
      default: 'Clerk',
    },
    department: {
      type: String,
      enum: [
        'Medicine', 'Surgery', 'Orthopedics', 'Pediatrics', 'ENT',
        'Ophthalmology', 'Gynecology', 'Dermatology', 'Oncology', 'CCU', 'ICU'
      ],
      default: null, // Only for Doctors, Nurses, and Paramedics
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);