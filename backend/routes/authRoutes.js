const express = require('express');
const router = express.Router();
const { signupUser, loginUser } = require('../controllers/authController'); // We will create this controller soon

// @desc    Register a new user
// @route   POST /api/auth/signup
// @access  Public
router.post('/signup', signupUser);

// @desc    Authenticate a user & get token
// @route   POST /api/auth/login
// @access  Public
router.post('/login', loginUser); // We'll implement this later

module.exports = router;