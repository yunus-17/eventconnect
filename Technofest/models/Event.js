const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['workshop', 'hackathon', 'tech-symposium', 'guest-lecture']
  },
  subCategory: {
    type: String,
    required: false,
    enum: ['technical', 'non-technical']
  },
  domain: {
    type: String,
    required: true
  },
  posterUrl: {
    type: String,
    required: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  duration: {
    type: String,
    required: true
  },
  coordinatorName: {
    type: String,
    required: true
  },
  coordinatorEmail: {
    type: String,
    required: true
  },
  coordinatorPhone: {
    type: String
  },
  venue: {
    type: String,
    required: true
  },
  formLink: {
    type: String,
    required: false
  },
  maxParticipants: {
    type: Number,
    default: 100
  },
  registrationDeadline: {
    type: Date,
    required: true
  },
  eventType: {
    intraDept: {
      type: Boolean,
      default: false
    },
    interDept: {
      type: Boolean,
      default: false
    },
    online: {
      type: Boolean,
      default: false
    },
    offline: {
      type: Boolean,
      default: true
    }
  },
  certificationProvided: {
    type: Boolean,
    default: false
  },
  prerequisites: {
    type: String
  },
  prizes: {
    type: String
  },
  rules: {
    type: String
  },
  // For hackathons
  rounds: [{
    roundNumber: Number,
    roundName: String,
    description: String,
    date: Date,
    duration: String
  }],
  // For tech symposiums
  events: [{
    eventName: String,
    description: String,
    time: String,
    venue: String,
    coordinator: String
  }],
  status: {
    type: String,
    enum: ['upcoming', 'ongoing', 'completed', 'cancelled'],
    default: 'upcoming'
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  // Additional fields for storing category-specific data
  additionalFields: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  }
});

// Update the updatedAt field before saving
eventSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Index for better query performance
eventSchema.index({ category: 1, status: 1 });
eventSchema.index({ startDate: 1 });
eventSchema.index({ createdBy: 1 });

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;