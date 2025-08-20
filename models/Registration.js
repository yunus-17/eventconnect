const mongoose = require('mongoose');

const registrationSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  event: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: true
  },
  rollNumber: {
    type: String,
    required: true
  },
  studentName: {
    type: String,
    required: true
  },
  studentEmail: {
    type: String,
    required: true
  },
  studentPhone: {
    type: String,
    required: true
  },
  department: {
    type: String,
    required: true
  },
  year: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['registered', 'waitlisted', 'confirmed', 'attended', 'absent', 'cancelled'],
    default: 'registered'
  },
  registrationDate: {
    type: Date,
    default: Date.now
  },
  teamMembers: [{
    name: String,
    rollNumber: String,
    department: String,
    year: Number,
    email: String,
    phone: String
  }],
  isTeamRegistration: {
    type: Boolean,
    default: false
  },
  teamName: {
    type: String
  },
  additionalInfo: {
    type: String
  },
  // For tracking participation results
  result: {
    position: {
      type: Number
    },
    score: {
      type: Number
    },
    remarks: {
      type: String
    },
    certificateIssued: {
      type: Boolean,
      default: false
    }
  },
  // Payment related (if applicable)
  paymentStatus: {
    type: String,
    enum: ['not-required', 'pending', 'completed', 'failed'],
    default: 'not-required'
  },
  paymentAmount: {
    type: Number,
    default: 0
  },
  paymentId: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Compound index to prevent duplicate registrations
registrationSchema.index({ student: 1, event: 1 }, { unique: true });

// Index for better query performance
registrationSchema.index({ event: 1, status: 1 });
registrationSchema.index({ rollNumber: 1 });
registrationSchema.index({ registrationDate: -1 });

// Update the updatedAt field before saving
registrationSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Virtual for team size
registrationSchema.virtual('teamSize').get(function() {
  return this.isTeamRegistration ? this.teamMembers.length + 1 : 1;
});

// Method to check if registration is still valid
registrationSchema.methods.isValidRegistration = function() {
  return ['registered', 'confirmed', 'waitlisted'].includes(this.status);
};

// Static method to get registrations for an event
registrationSchema.statics.getEventRegistrations = function(eventId, status = null) {
  const query = { event: eventId };
  if (status) {
    query.status = status;
  }
  return this.find(query)
    .populate('student', 'name rollNumber department year')
    .populate('event', 'title category startDate')
    .sort({ registrationDate: -1 });
};

// Static method to get student's registrations
registrationSchema.statics.getStudentRegistrations = function(studentId, status = null) {
  const query = { student: studentId };
  if (status) {
    query.status = status;
  }
  return this.find(query)
    .populate('event', 'title category startDate endDate venue status posterUrl')
    .sort({ registrationDate: -1 });
};

const Registration = mongoose.model('Registration', registrationSchema);

module.exports = Registration;