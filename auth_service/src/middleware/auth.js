const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

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
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.userId).select("-password");
    if (!req.user) return res.status(404).json({ message: "User not found" });
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token. Authentication failed." });
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
  
      next();
    };
  };
module.exports = { authenticateUser, authorizeRole };
