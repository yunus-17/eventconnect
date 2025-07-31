const express = require('express');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const { User, Student, Admin } = require('../models/User');
const { auth, requireAdmin, requireStudent } = require('../middleware/auth');

const router = express.Router();

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '24h' });
};

// Student Login
router.post('/student-login', [
  body('rollNumber')
    .matches(/^\d{2}[A-Z]{2,3}\d{3}$/)
    .withMessage('Roll number must be in format: 22IT101 or 23ITR001'),
  body('password')
    .isLength({ min: 1 })
    .withMessage('Password is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: errors.array()
      });
    }

    const { rollNumber, password } = req.body;

    // Find student by roll number
    const student = await Student.findOne({ rollNumber });
    if (!student) {
      return res.status(401).json({
        success: false,
        message: 'Invalid roll number or password'
      });
    }

    // Check password
    const isPasswordValid = await student.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid roll number or password'
      });
    }

    // Update last login
    student.lastLogin = new Date();
    await student.save();

    // Generate token
    const token = generateToken(student._id);

    res.json({
      success: true,
      message: 'Student login successful',
      token,
      user: {
        id: student._id,
        rollNumber: student.rollNumber,
        name: student.name,
        department: student.department,
        year: student.year,
        role: student.role,
        isFirstLogin: student.isFirstLogin
      },
      redirectTo: '/user-dashboard'
    });

  } catch (error) {
    console.error('Student login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Admin Login
router.post('/admin-login', [
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .isLength({ min: 1 })
    .withMessage('Password is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: errors.array()
      });
    }

    const { email, password } = req.body;

    // Find admin by email
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Check password
    const isPasswordValid = await admin.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Update last login
    admin.lastLogin = new Date();
    await admin.save();

    // Generate token
    const token = generateToken(admin._id);

    res.json({
      success: true,
      message: 'Admin login successful',
      token,
      user: {
        id: admin._id,
        email: admin.email,
        name: admin.name,
        department: admin.department,
        permissions: admin.permissions,
        role: admin.role,
        isFirstLogin: admin.isFirstLogin
      },
      redirectTo: '/admin-dashboard'
    });

  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Change Password (for both students and admins)
router.post('/change-password', auth, [
  body('currentPassword')
    .isLength({ min: 1 })
    .withMessage('Current password is required'),
  body('newPassword')
    .isLength({ min: 6 })
    .withMessage('New password must be at least 6 characters long')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: errors.array()
      });
    }

    const { currentPassword, newPassword } = req.body;
    const user = req.user;

    // Verify current password
    const isCurrentPasswordValid = await user.comparePassword(currentPassword);
    if (!isCurrentPasswordValid) {
      return res.status(400).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }

    // Update password
    await user.updatePassword(newPassword);

    res.json({
      success: true,
      message: 'Password changed successfully'
    });

  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Get current user profile
router.get('/profile', auth, async (req, res) => {
  try {
    const user = req.user;
    
    // Populate user data based on role
    let userData = {
      id: user._id,
      role: user.role,
      isFirstLogin: user.isFirstLogin,
      createdAt: user.createdAt,
      lastLogin: user.lastLogin
    };

    if (user.role === 'student') {
      userData = {
        ...userData,
        rollNumber: user.rollNumber,
        name: user.name,
        department: user.department,
        year: user.year
      };
    } else if (user.role === 'admin') {
      userData = {
        ...userData,
        email: user.email,
        name: user.name,
        department: user.department,
        permissions: user.permissions
      };
    }

    res.json({
      success: true,
      user: userData
    });

  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Logout (client-side token removal)
router.post('/logout', auth, async (req, res) => {
  try {
    // In a more advanced system, you might want to blacklist the token
    // For now, we'll just return success and let the client remove the token
    res.json({
      success: true,
      message: 'Logged out successfully'
    });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Admin-only: Create new student account
router.post('/create-student', auth, requireAdmin, [
  body('rollNumber')
    .matches(/^\d{2}[A-Z]{2,3}\d{3}$/)
    .withMessage('Roll number must be in format: 22IT101 or 23ITR001'),
  body('name')
    .isLength({ min: 1 })
    .withMessage('Name is required'),
  body('department')
    .isLength({ min: 1 })
    .withMessage('Department is required'),
  body('year')
    .isInt({ min: 1, max: 4 })
    .withMessage('Year must be between 1 and 4')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: errors.array()
      });
    }

    const { rollNumber, name, department, year } = req.body;

    // Check if student already exists
    const existingStudent = await Student.findOne({ rollNumber });
    if (existingStudent) {
      return res.status(400).json({
        success: false,
        message: 'Student with this roll number already exists'
      });
    }

    // Create new student with default password
    const defaultPassword = 'kongu@123';
    const student = new Student({
      rollNumber,
      name,
      department,
      year,
      role: 'student',
      password: defaultPassword
    });

    await student.save();

    res.status(201).json({
      success: true,
      message: 'Student account created successfully',
      student: {
        id: student._id,
        rollNumber: student.rollNumber,
        name: student.name,
        department: student.department,
        year: student.year
      }
    });

  } catch (error) {
    console.error('Create student error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router; 