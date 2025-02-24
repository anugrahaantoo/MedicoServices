const express = require('express');
const { registerUser, getAllUsers } = require('../controllers/userController');
const { isAdmin, authenticate } = require('../middleware/auth'); // Import both middlewares

const router = express.Router();

// Route to register a new user
router.post('/register', isAdmin, registerUser);

// Route to fetch all users
router.get('/users', authenticate, isAdmin, getAllUsers); // Use authenticate before isAdmin

module.exports = router;