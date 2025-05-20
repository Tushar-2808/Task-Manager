const asyncHandler = require('express-async-handler');
const Task = require('../models/taskModel');
const User = require('../models/userModel'); // Needed to check task ownership

// @desc    Get all tasks for the logged-in user
// @route   GET /api/tasks
// @access  Private
const getTasks = asyncHandler(async (req, res) => {
  // req.user is available here because of the protect middleware
  const tasks = await Task.find({ user: req.user._id }).sort({ createdAt: -1 }); // Find tasks belonging to the logged-in user, sort by creation date

  res.json(tasks);
});

// @desc    Create a new task
// @route   POST /api/tasks
// @access  Private
const createTask = asyncHandler(async (req, res) => {
  const { title, description, status, dueDate } = req.body;

  if (!title) {
    res.status(400);
    throw new Error('Please add a title');
  }

  // Create the task, linking it to the logged-in user
  const task = await Task.create({
    title,
    description,
    status,
    dueDate,
    user: req.user._id, // Set the user field to the logged-in user's ID
  });

  res.status(201).json(task); // 201 means Created
});

// @desc    Get a single task by ID for the logged-in user
// @route   GET /api/tasks/:id
// @access  Private
const getTaskById = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);

  if (!task) {
    res.status(404); // Not Found
    throw new Error('Task not found');
  }

  // Make sure the logged-in user owns the task
  if (task.user.toString() !== req.user._id.toString()) {
    res.status(401); // Unauthorized
    throw new Error('Not authorized to view this task');
  }

  res.json(task);
});

// @desc    Update a task by ID for the logged-in user
// @route   PUT /api/tasks/:id
// @access  Private
const updateTask = asyncHandler(async (req, res) => {
  const { title, description, status, dueDate } = req.body;

  const task = await Task.findById(req.params.id);

  if (!task) {
    res.status(404); // Not Found
    throw new Error('Task not found');
  }

  // Make sure the logged-in user owns the task
  if (task.user.toString() !== req.user._id.toString()) {
    res.status(401); // Unauthorized
    throw new Error('Not authorized to update this task');
  }

  // Update the task fields
  task.title = title || task.title; // Use new value if provided, otherwise keep old
  task.description = description || task.description;
  task.status = status || task.status;
  task.dueDate = dueDate || task.dueDate;

  // Save the updated task
  const updatedTask = await task.save(); // or use findByIdAndUpdate

  res.json(updatedTask);
});

// @desc    Delete a task by ID for the logged-in user
// @route   DELETE /api/tasks/:id
// @access  Private
const deleteTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);

  if (!task) {
    res.status(404); // Not Found
    throw new Error('Task not found');
  }

  // Make sure the logged-in user owns the task
  if (task.user.toString() !== req.user._id.toString()) {
    res.status(401); // Unauthorized
    throw new Error('Not authorized to delete this task');
  }

  // Remove the task
  await task.deleteOne(); // Mongoose v6+ uses deleteOne() or deleteMany()

  res.json({ message: 'Task removed' });
});


module.exports = {
  getTasks,
  createTask,
  getTaskById,
  updateTask,
  deleteTask,
};