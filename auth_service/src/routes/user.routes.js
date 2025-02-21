const express = require("express");
const { registerUser, loginUser } = require("../controllers/user.controller");
const { authenticateUser, authorizeRole } = require("../middleware/auth");

const router = express.Router();

// Public routes - registration and login
router.post("/register", authenticateUser, authorizeRole("Admin"), registerUser);  // Admin only registration route
router.post("/login", loginUser);        // Public login route

// Protected route: User Profile (Authenticated users)
router.get("/profile", authenticateUser, (req, res) => {
  res.json({ message: "User Profile Data", user: req.user });
});

// Admin route: Admin can see all profiles
router.get("/admin", authenticateUser, authorizeRole("Admin"), (req, res) => {
  res.json({ message: "Admin Access Granted" });
});

module.exports = router;
