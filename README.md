# MERN Stack Task Manager Application

## 🚀 Live Demo

Experience the live application here:
**Frontend:** [https://task-manager-one-dusky.vercel.app/](https://task-manager-one-dusky.vercel.app/)

## ✨ Overview

This is a full-stack task management application built using the MERN (MongoDB, Express.js, React, Node.js) stack. It provides a user-friendly interface for creating, managing, and tracking your daily tasks with secure user authentication.

## 🌟 Features

* **User Authentication:** Secure sign-up and login functionalities with JSON Web Tokens (JWT) for session management.
* **Password Hashing:** User passwords are securely stored using `bcrypt` hashing.
* **Task Management:**
    * Create new tasks with a title, description, status (pending/completed), and due date.
    * View all tasks for the logged-in user.
    * Update existing tasks (e.g., change status, edit details).
    * Delete tasks.
* **Task Filtering:** Filter tasks by status (pending/completed) or due date.
* **Responsive Design:** Basic aesthetic styling for a cleaner look.

## 🛠️ Technologies Used

**Backend:**
* **Node.js:** JavaScript runtime environment.
* **Express.js:** Web application framework for Node.js.
* **MongoDB:** NoSQL database for data storage.
* **Mongoose:** ODM (Object Data Modeling) library for MongoDB and Node.js.
* **JSON Web Tokens (JWT):** For secure user authentication and authorization.
* **Bcrypt.js:** For hashing passwords.
* **CORS:** Middleware for enabling Cross-Origin Resource Sharing.
* **dotenv:** For loading environment variables.
* **express-async-handler:** Simple middleware for handling exceptions in async Express routes.

**Frontend:**
* **React:** JavaScript library for building user interfaces.
* **Vite:** Fast build tool for modern web projects.
* **React Router DOM:** For declarative routing in React applications.
* **Axios:** Promise-based HTTP client for making API requests.

