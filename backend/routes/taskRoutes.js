const express = require('express');
const router = express.Router();
const {
  getTasks,
  createTask,
  getTaskById,
  updateTask,
  deleteTask,
} = require('../controllers/taskController'); // We will create this controller soon

const { protect } = require('../middleware/authMiddleware'); // Import the protect middleware

// Routes that require authentication
router.route('/').get(protect, getTasks).post(protect, createTask); // GET all tasks and POST a new task

// Routes for specific tasks by ID
router.route('/:id').get(protect, getTaskById).put(protect, updateTask).delete(protect, deleteTask); // GET, PUT, DELETE a single task

module.exports = router;