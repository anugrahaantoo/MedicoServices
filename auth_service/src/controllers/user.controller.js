const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/user.model");

// @desc    Login user
// @route   POST /api/users/login
// @access  Public
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Check if password is correct
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Create JWT payload
    const payload = {
      userId: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      department: user.department || null, // Include department if applicable
    };

    // Generate JWT token
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(200).json({
      token,
      role: user.role,
      department: user.department || null,
    });
  } catch (error) {
    console.error("Error in login:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Register new user
// @route   POST /api/users/register
// @access  Private (Admin only for certain roles)
const registerUser = async (req, res) => {
  const { name, email, password, role, department } = req.body;
  const requestingUser = req.user; // Extracted from authentication middleware

  try {
    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Default role for the first user is Admin, otherwise Clerk
    let newRole =
      role || ((await User.countDocuments()) === 0 ? "Admin" : "Clerk");

    // If the role is Admin, we skip token authentication check
    if (newRole !== "Admin" && !requestingUser) {
      return res.status(403).json({ message: "Token is required for registration" });
    }

    // Only Admin can register 'Doctor', 'Nurse', 'Paramedic', and 'Clerk'
    const restrictedRoles = ["Doctor", "Nurse", "Paramedic", "Clerk"];
    if (restrictedRoles.includes(newRole) && requestingUser.role !== "Admin") {
      return res.status(403).json({
        message: "Only Admin can register Doctor, Nurse, Paramedic, and Clerk",
      });
    }

    // Admin and Clerk should not have a department
    if (["Admin", "Clerk"].includes(newRole) && department) {
      return res
        .status(400)
        .json({ message: `${newRole} should not be assigned a department` });
    }

    // Doctor, Nurse, and Paramedic should have a department
    if (["Doctor", "Nurse", "Paramedic"].includes(newRole) && !department) {
      return res
        .status(400)
        .json({ message: `Department is required for ${newRole}` });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    user = new User({
      name,
      email,
      password: hashedPassword,
      role: newRole,
      department: department || null, // Assign department only if required
    });

    // Save user to database
    await user.save();

    // Create JWT payload
    const payload = {
      userId: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      department: user.department || null,
    };

    // Generate JWT token
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      department: user.department || null,
      token,
    });
  } catch (error) {
    console.error("Error in registration:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { registerUser, loginUser };
