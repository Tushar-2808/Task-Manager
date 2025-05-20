// Load environment variables from .env file
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose'); // Import mongoose

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1); // Exit process with failure
  }
};

connectDB(); // Call the connection function

// Basic route for testing
app.get('/', (req, res) => {
  res.send('API is running...');
});

const authRoutes = require('./routes/authRoutes'); // Import auth routes
const taskRoutes = require('./routes/taskRoutes'); // Import task routes

// Mount Auth Routes
app.use('/api/auth', authRoutes);

// Mount Task Routes
app.use('/api/tasks', taskRoutes); // Use the task routes for requests starting with /api/tasks


// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});