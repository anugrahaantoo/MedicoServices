const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

const roleRoutes = require("./routes/role.routes");

require('dotenv').config();
const app = express();

// Middleware
app.use(express.json());


// MongoDB Connection
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("MongoDB Connected");
  })
  .catch((err) => {
    console.error("MongoDB Connection Error:", err);
  });

// Routes
app.use("/api/roles", roleRoutes);

// Basic test route
app.get("/", (req, res) => {
    res.send("Welcome to MedicoPlus Backend");
  });
  
  
  // Server setup
  const PORT = process.env.PORT || 3002;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
  