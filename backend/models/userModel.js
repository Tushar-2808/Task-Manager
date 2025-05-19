const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); // We'll need bcrypt for password hashing later

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true, // Ensure email addresses are unique
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt timestamps automatically
  }
);

// We will add password hashing middleware here later (before saving)

// We will add password hashing middleware here later (before saving)
// Add this block:
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next(); // If password is not modified, move to the next middleware/save operation
  }

  // Hash password
  const salt = await bcrypt.genSalt(10); // Generate a salt with 10 rounds
  this.password = await bcrypt.hash(this.password, salt); // Hash the password
});

// Add a method to compare entered password with hashed password
// This will be useful for login later
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};


const User = mongoose.model('User', userSchema);

module.exports = User;