const jwt = require("jsonwebtoken");
const axios = require("axios");  // Used to communicate with external user service

// Middleware to authenticate the user using JWT
const authenticateUser = async (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  // Skip token check if Admin (allow Admin to access without token)
  if (req.body.role === "Admin" && !token) {
    // Create a fake `req.user` for Admin since they don't need token
    req.user = { role: "Admin" }; // Add Admin directly
    return next(); // Skip token check for Admin
  }

  if (!token) {
    return res.status(401).json({ message: "Access Denied. No token provided." });
  }
  
  try {
    // Verify token and decode user information
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { 
      role: decoded.role, 
      userId: decoded.userId 
    };

    // Optionally, make a request to the user service to ensure the user exists
    const userResponse = await axios.get(`${process.env.USER_SERVICE_URL}/users/${req.user.userId}`);
    if (!userResponse.data) {
      return res.status(404).json({ message: "User not found" });
    }

    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    return res.status(401).json({ message: "Invalid token. Authentication failed." });
  }
};

// Middleware to restrict access based on roles
const authorizeRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user?.role) {
      return res.status(403).json({ message: "Access Forbidden: No role assigned" });
    }

    // Check if user's role is in allowed roles
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Access Forbidden: Insufficient permissions" });
    }

    next(); // Proceed to the next middleware or route handler
  };
};

// Permissions for patient registration, viewing, and listing patients
const registerPatientPermissions = authorizeRole("Clerk", "Admin");
const viewPatientDetailsPermissions = authorizeRole("Doctor", "Clerk", "Admin", "Nurse", "Paramedic");
const listAllPatientsPermissions = authorizeRole("Clerk", "Admin");

module.exports = {
  authenticateUser,
  authorizeRole,
  registerPatientPermissions,
  viewPatientDetailsPermissions,
  listAllPatientsPermissions
};
