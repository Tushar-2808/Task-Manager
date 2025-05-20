const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');

const protect = asyncHandler(async (req, res, next) => {
  let token;

  // Check for token in the Authorization header
  // Format: "Bearer TOKEN"
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1]; // Split "Bearer TOKEN" into ["Bearer", "TOKEN"] and take the second element

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Find user by the ID in the token payload and attach to request object
      // .select('-password') excludes the password field
      req.user = await User.findById(decoded.id).select('-password');

      next(); // Move to the next middleware or route handler
    } catch (error) {
      console.error(error);
      res.status(401); // Unauthorized
      throw new Error('Not authorized, token failed');
    }
  }

  // If no token is found in the header
  if (!token) {
    res.status(401); // Unauthorized
    throw new Error('Not authorized, no token');
  }
});

module.exports = { protect };