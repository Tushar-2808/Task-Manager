const mongoose = require('mongoose');

const taskSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId, // This links the task to a specific user
      required: true,
      ref: 'User', // This tells Mongoose which model to use for the population
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    status: {
      type: String,
      required: true,
      enum: ['pending', 'completed'], // Restrict status to these values
      default: 'pending',
    },
    dueDate: {
      type: Date, // Store due date as a Date object
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt timestamps automatically
  }
);

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;
