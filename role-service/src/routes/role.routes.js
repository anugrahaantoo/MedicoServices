const express = require("express");
const router = express.Router();
const { createRole, getAllRoles, updateRole, deleteRole } = require("../controllers/role.controller");
const { authenticateUser, authorizeRole } = require("../middleware/auth");

// Public: Get all roles (No authentication required)
router.get("/", getAllRoles);

// Admin-only routes
router.post("/", authenticateUser, authorizeRole("Admin"), createRole);
router.put("/", authenticateUser, authorizeRole("Admin"), updateRole);
router.delete("/:name", authenticateUser, authorizeRole("Admin"), deleteRole);

module.exports = router;
