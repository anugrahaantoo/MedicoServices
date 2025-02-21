const express = require("express");
const router = express.Router();
const {
  registerPatient,
  getPatientDetails,
  listAllPatients,
  updatePatientDetails,
} = require("../controllers/patient.controller");
const { authenticateUser, authorizeRole } = require("../middleware/auth");

// Register a new patient (only for registration clerks)
router.post(
  "/register",
  authenticateUser,
  authorizeRole("Clerk"), // Ensure only clerks can register patients
  registerPatient
);

// View patient details (accessible by doctors, nurses, and paramedics)
router.get(
  "/:id/details",
  authenticateUser,
  authorizeRole("Doctor", "Nurse", "Paramedic"), // Doctors, Nurses, and Paramedics can view patient details
  getPatientDetails
);

// Update patient details (additional diseases and referral details)
router.put(
  "/:id/update",
  authenticateUser,
  authorizeRole("Doctor", "Nurse", "Paramedic"), // Doctors, Nurses, and Paramedics can update patient details
  updatePatientDetails
);

// List all patients (only for registration clerks or admins)
router.get(
  "/all",
  authenticateUser,
  authorizeRole("Clerk", "Admin"), // Ensure only clerks or admins can list all patients
  listAllPatients
);

module.exports = router;
