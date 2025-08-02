const express = require('express');
const { body, validationResult } = require('express-validator');
const Event = require('../models/Event');
const Registration = require('../models/Registration');
const { auth, requireStudent } = require('../middleware/auth');

const router = express.Router();

// Register for an event (Student only)
router.post('/', auth, requireStudent, [
  body('eventId').isMongoId().withMessage('Valid event ID is required'),
  body('studentPhone').isMobilePhone().withMessage('Valid phone number is required'),
  body('studentEmail').isEmail().withMessage('Valid email is required'),
  body('isTeamRegistration').optional().isBoolean().withMessage('Team registration must be boolean'),
  body('teamName').optional().trim().isLength({ min: 1 }).withMessage('Team name cannot be empty'),
  body('teamMembers').optional().isArray().withMessage('Team members must be an array'),
  body('additionalInfo').optional().trim()
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

    const { eventId, studentPhone, studentEmail, isTeamRegistration, teamName, teamMembers, additionalInfo } = req.body;

    // Check if event exists and is open for registration
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    if (event.status !== 'upcoming') {
      return res.status(400).json({
        success: false,
        message: 'Event is not open for registration'
      });
    }

    if (new Date() > event.registrationDeadline) {
      return res.status(400).json({
        success: false,
        message: 'Registration deadline has passed'
      });
    }

    // Check if student is already registered
    const existingRegistration = await Registration.findOne({
      student: req.user._id,
      event: eventId
    });

    if (existingRegistration) {
      return res.status(400).json({
        success: false,
        message: 'You are already registered for this event'
      });
    }

    // Check if event has available spots
    const currentRegistrations = await Registration.countDocuments({
      event: eventId,
      status: { $in: ['registered', 'confirmed'] }
    });

    if (currentRegistrations >= event.maxParticipants) {
      return res.status(400).json({
        success: false,
        message: 'Event is full. Registration closed.'
      });
    }

    // Validate team registration
    if (isTeamRegistration) {
      if (!teamName) {
        return res.status(400).json({
          success: false,
          message: 'Team name is required for team registration'
        });
      }

      if (!teamMembers || teamMembers.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Team members are required for team registration'
        });
      }

      // Validate team members
      for (const member of teamMembers) {
        if (!member.name || !member.rollNumber || !member.department || !member.year) {
          return res.status(400).json({
            success: false,
            message: 'All team member details are required'
          });
        }
      }
    }

    // Create registration
    const registrationData = {
      student: req.user._id,
      event: eventId,
      rollNumber: req.user.rollNumber,
      studentName: req.user.name,
      studentEmail,
      studentPhone,
      department: req.user.department,
      year: req.user.year,
      isTeamRegistration: isTeamRegistration || false,
      teamName: isTeamRegistration ? teamName : undefined,
      teamMembers: isTeamRegistration ? teamMembers : [],
      additionalInfo
    };

    const registration = new Registration(registrationData);
    await registration.save();

    await registration.populate([
      { path: 'student', select: 'name rollNumber department year' },
      { path: 'event', select: 'title category startDate venue' }
    ]);

    res.status(201).json({
      success: true,
      message: 'Registration successful',
      registration
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Get student's registrations
router.get('/my-registrations', auth, requireStudent, async (req, res) => {
  try {
    const registrations = await Registration.getStudentRegistrations(req.user._id);

    res.json({
      success: true,
      registrations,
      count: registrations.length
    });

  } catch (error) {
    console.error('Get registrations error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Get specific registration details
router.get('/:id', auth, async (req, res) => {
  try {
    const registration = await Registration.findById(req.params.id)
      .populate('student', 'name rollNumber department year')
      .populate('event', 'title category startDate endDate venue posterUrl coordinatorName coordinatorEmail');

    if (!registration) {
      return res.status(404).json({
        success: false,
        message: 'Registration not found'
      });
    }

    // Check if user has permission to view this registration
    if (req.user.role === 'student' && registration.student._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    res.json({
      success: true,
      registration
    });

  } catch (error) {
    console.error('Get registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Cancel registration (Student only)
router.delete('/:id', auth, requireStudent, async (req, res) => {
  try {
    const registration = await Registration.findById(req.params.id);

    if (!registration) {
      return res.status(404).json({
        success: false,
        message: 'Registration not found'
      });
    }

    // Check if user owns this registration
    if (registration.student.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Check if cancellation is allowed
    const event = await Event.findById(registration.event);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    // Allow cancellation only if event hasn't started
    if (new Date() >= event.startDate) {
      return res.status(400).json({
        success: false,
        message: 'Cannot cancel registration after event has started'
      });
    }

    registration.status = 'cancelled';
    await registration.save();

    res.json({
      success: true,
      message: 'Registration cancelled successfully'
    });

  } catch (error) {
    console.error('Cancel registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Update registration status (Admin only)
router.patch('/:id/status', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Admin access required'
      });
    }

    const { status } = req.body;
    const validStatuses = ['registered', 'waitlisted', 'confirmed', 'attended', 'absent', 'cancelled'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status'
      });
    }

    const registration = await Registration.findById(req.params.id);
    if (!registration) {
      return res.status(404).json({
        success: false,
        message: 'Registration not found'
      });
    }

    registration.status = status;
    await registration.save();

    await registration.populate([
      { path: 'student', select: 'name rollNumber department year' },
      { path: 'event', select: 'title category' }
    ]);

    res.json({
      success: true,
      message: 'Registration status updated successfully',
      registration
    });

  } catch (error) {
    console.error('Update registration status error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Check if student can register for an event
router.get('/check/:eventId', auth, requireStudent, async (req, res) => {
  try {
    const { eventId } = req.params;

    // Check if event exists
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    // Check if already registered
    const existingRegistration = await Registration.findOne({
      student: req.user._id,
      event: eventId
    });

    if (existingRegistration) {
      return res.json({
        success: true,
        canRegister: false,
        reason: 'Already registered',
        registration: existingRegistration
      });
    }

    // Check if registration is open
    if (event.status !== 'upcoming') {
      return res.json({
        success: true,
        canRegister: false,
        reason: 'Event is not open for registration'
      });
    }

    if (new Date() > event.registrationDeadline) {
      return res.json({
        success: true,
        canRegister: false,
        reason: 'Registration deadline has passed'
      });
    }

    // Check available spots
    const currentRegistrations = await Registration.countDocuments({
      event: eventId,
      status: { $in: ['registered', 'confirmed'] }
    });

    if (currentRegistrations >= event.maxParticipants) {
      return res.json({
        success: true,
        canRegister: false,
        reason: 'Event is full'
      });
    }

    res.json({
      success: true,
      canRegister: true,
      spotsRemaining: event.maxParticipants - currentRegistrations
    });

  } catch (error) {
    console.error('Check registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router;