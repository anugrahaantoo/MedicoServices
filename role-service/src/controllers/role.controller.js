const Role = require("../models/role.model");

// Create a new role
const createRole = async (req, res) => {
  try {
    const { name, permissions } = req.body;

    // Check if role already exists
    const existingRole = await Role.findOne({ name });
    if (existingRole) {
      return res.status(400).json({ message: "Role already exists" });
    }

    const role = new Role({ name, permissions });
    await role.save();
    
    res.status(201).json({ message: "Role created successfully", role });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get all roles
const getAllRoles = async (req, res) => {
  try {
    const roles = await Role.find();
    res.json(roles);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Update role permissions
const updateRole = async (req, res) => {
  try {
    const { name, permissions } = req.body;
    const role = await Role.findOne({ name });

    if (!role) {
      return res.status(404).json({ message: "Role not found" });
    }

    role.permissions = permissions;
    await role.save();
    
    res.json({ message: "Role updated successfully", role });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Delete a role
const deleteRole = async (req, res) => {
  try {
    const { name } = req.params;

    const role = await Role.findOneAndDelete({ name });
    if (!role) {
      return res.status(404).json({ message: "Role not found" });
    }

    res.json({ message: "Role deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { createRole, getAllRoles, updateRole, deleteRole };
