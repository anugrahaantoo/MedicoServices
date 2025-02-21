const Patient = require('../models/patient.model');
const asyncHandler = fn => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// Register a new patient (Only accessible by 'clerk' role)
const registerPatient = asyncHandler(async (req, res) => {
  // Ensure the user has the 'clerk' role
  if (req.user.role !== 'Clerk') {
    return res.status(403).json({ message: 'Access Forbidden: Only clerks can register patients' });
  }

  const { name, age, contact, gender, healthComplaints } = req.body;

  // Validate patient data
  const validationError = validatePatientData(req.body);
  if (validationError) {
    return res.status(400).json({ message: validationError });
  }

  const newPatient = new Patient({
    patientID: generatePatientID(),
    name,
    age,
    contact,
    gender,
    healthComplaints,
  });

  await newPatient.save();
  res.status(201).json(newPatient);
});

// Helper function to validate patient data
const validatePatientData = (data) => {
  const { name, age, contact, gender, healthComplaints } = data;
  if (!name || !age || !contact || !gender || !healthComplaints) {
    return 'Missing required fields';
  }

  // You can add more validation for contact if needed (e.g., regex for phone number format)
  return null;
};

// Generate a unique patient ID
const generatePatientID = () => {
  return `P${Date.now()}-${Math.floor(Math.random() * 1000)}`;
};

// Fetch patient details by ID (accessible by Doctor, Nurse, or Paramedic)
const getPatientDetails = asyncHandler(async (req, res) => {
  if (![ 'Doctor', 'Nurse', 'Paramedic' ].includes(req.user.role)) {
    return res.status(403).json({ message: 'Access Forbidden: Only doctors, nurses, or paramedics can view patient details' });
  }

  const patient = await Patient.findOne({ patientID: req.params.id });
  if (!patient) {
    return res.status(404).json({ message: 'Patient not found' });
  }
  res.json(patient);
});

// Update patient details (additional diseases and referral details)
const updatePatientDetails = asyncHandler(async (req, res) => {
  const { additionalDiseases, referralDetails } = req.body;

  if (![ 'Doctor', 'Nurse', 'Paramedic' ].includes(req.user.role)) {
    return res.status(403).json({ message: 'Access Forbidden: Only doctors, nurses, or paramedics can update patient details' });
  }

  const patient = await Patient.findOne({ patientID: req.params.id });
  if (!patient) {
    return res.status(404).json({ message: 'Patient not found' });
  }

  // Update additional diseases and referral details
  if (additionalDiseases) {
    patient.additionalDiseases = additionalDiseases;
  }
  if (referralDetails) {
    patient.referralDetails = referralDetails;
  }

  await patient.save();
  res.status(200).json({ message: 'Patient details updated successfully', patient });
});

// List all patients (Only accessible by 'clerk' or 'admin' roles)
const listAllPatients = asyncHandler(async (req, res) => {
  if (![ 'Clerk', 'Admin' ].includes(req.user.role)) {
    return res.status(403).json({ message: 'Access Forbidden: Only clerks or admins can list patients' });
  }

  let filter = {};

  if (req.query.date) {
    const date = new Date(req.query.date);
    const startOfDay = new Date(date.setHours(0, 0, 0));
    const endOfDay = new Date(date.setHours(23, 59, 59));
    filter.registrationDate = { $gte: startOfDay, $lt: endOfDay };
  }

  const patients = await Patient.find(filter);
  res.json(patients);
});

module.exports = { registerPatient, getPatientDetails, listAllPatients, updatePatientDetails };
