const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  // Common fields for both students and admins
  role: {
    type: String,
    enum: ['student', 'admin'],
    required: true
  },
  password: {
    type: String,
    required: true
  },
  isFirstLogin: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  lastLogin: {
    type: Date
  }
}, {
  discriminatorKey: 'userType'
});

// Student-specific fields
const studentSchema = new mongoose.Schema({
  rollNumber: {
    type: String,
    required: true,
    unique: true,
    match: /^\d{2}[A-Z]{2,3}\d{3}$/ // Format: 22IT101 or 23ITR001
  },
  name: {
    type: String,
    required: true
  },
  department: {
    type: String,
    required: true
  },
  year: {
    type: Number,
    required: true,
    min: 1,
    max: 4
  },
  cgpa: {
    type: Number,
    default: 0.0,
    min: 0.0,
    max: 10.0
  },
  attendance: {
    type: Number,
    default: 75.0,
    min: 0.0,
    max: 100.0
  }
});

// Admin-specific fields
const adminSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    match: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/
  },
  name: {
    type: String,
    required: true
  },
  department: {
    type: String
  },
  permissions: [{
    type: String,
    enum: ['read', 'write', 'delete', 'admin']
  }]
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Method to update password
userSchema.methods.updatePassword = async function(newPassword) {
  this.password = newPassword;
  this.isFirstLogin = false;
  return await this.save();
};

// Create the base User model
const User = mongoose.model('User', userSchema);

// Create discriminators for Student and Admin
const Student = User.discriminator('Student', studentSchema);
const Admin = User.discriminator('Admin', adminSchema);

module.exports = { User, Student, Admin }; 