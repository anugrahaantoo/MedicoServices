const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db'); // Ensure this path is correct
const userRoutes = require('./routes/userRoutes');

dotenv.config(); // Load environment variables from .env file
connectDB(); // Connect to MongoDB

const app = express();
app.use(express.json());

app.use('/api/users', userRoutes);

const PORT = process.env.PORT || 5000; // Use the PORT from .env or default to 5000
app.listen(PORT, () => {
    console.log(`User Management Service running on port ${PORT}`);
});