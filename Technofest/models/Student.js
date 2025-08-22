const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  rollNumber: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  name: {
    type: String,
    required: false,
    trim: true
  },
  cgpa: {
    type: Number,
    required: false,
    min: 0,
    max: 10,
    default: null
  }
}, {
  timestamps: true
});

// Index for faster queries by rollNumber
studentSchema.index({ rollNumber: 1 });

module.exports = mongoose.model('AcademicStudent', studentSchema);
