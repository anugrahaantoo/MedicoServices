const express = require('express');
const dotenv = require("dotenv");
const mongoose = require('mongoose');
const userRoutes = require('./routes/user.routes');

dotenv.config(); // Initialize dotenv to load environment variables

const app = express();
app.use(express.json());

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

app.use("/api/users", userRoutes);

// Basic test route
app.get("/", (req, res) => {
  res.send("Welcome to MedicoPlus Backend");
});


// Server setup
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
