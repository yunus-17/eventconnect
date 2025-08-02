const express = require('express');
const { body, validationResult, query } = require('express-validator');
const Event = require('../models/Event');
const Registration = require('../models/Registration');
const { auth, requireAdmin, requireStudent } = require('../middleware/auth');

const router = express.Router();

// Get all events (public route with optional filtering)
router.get('/', [
  query('category').optional().isIn(['workshop', 'hackathon', 'tech-symposium', 'guest-lecture']),
  query('status').optional().isIn(['upcoming', 'ongoing', 'completed', 'cancelled']),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('page').optional().isInt({ min: 1 })
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

    const { category, status, limit = 10, page = 1 } = req.query;
    const skip = (page - 1) * limit;

    // Build query
    const query = {};
    if (category) query.category = category;
    if (status) query.status = status;

    const events = await Event.find(query)
      .populate('createdBy', 'name email')
      .sort({ startDate: 1 })
      .limit(parseInt(limit))
      .skip(skip);

    const total = await Event.countDocuments(query);

    res.json({
      success: true,
      events,
      pagination: {
        current: parseInt(page),
        total: Math.ceil(total / limit),
        count: events.length,
        totalEvents: total
      }
    });

  } catch (error) {
    console.error('Get events error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Get single event by ID
router.get('/:id', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate('createdBy', 'name email department');

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    // Get registration count
    const registrationCount = await Registration.countDocuments({ 
      event: event._id, 
      status: { $in: ['registered', 'confirmed'] }
    });

    res.json({
      success: true,
      event: {
        ...event.toObject(),
        registrationCount,
        spotsRemaining: event.maxParticipants - registrationCount
      }
    });

  } catch (error) {
    console.error('Get event error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Create new event (Admin only)
router.post('/', auth, requireAdmin, [
  body('title').trim().isLength({ min: 1 }).withMessage('Title is required'),
  body('description').trim().isLength({ min: 1 }).withMessage('Description is required'),
  body('category').isIn(['workshop', 'hackathon', 'tech-symposium', 'guest-lecture']).withMessage('Invalid category'),
  body('domain').trim().isLength({ min: 1 }).withMessage('Domain is required'),
  body('posterUrl').isURL().withMessage('Valid poster URL is required'),
  body('startDate').isISO8601().withMessage('Valid start date is required'),
  body('endDate').isISO8601().withMessage('Valid end date is required'),
  body('duration').trim().isLength({ min: 1 }).withMessage('Duration is required'),
  body('coordinatorName').trim().isLength({ min: 1 }).withMessage('Coordinator name is required'),
  body('coordinatorEmail').isEmail().withMessage('Valid coordinator email is required'),
  body('venue').trim().isLength({ min: 1 }).withMessage('Venue is required'),
  body('maxParticipants').isInt({ min: 1 }).withMessage('Max participants must be a positive number'),
  body('registrationDeadline').isISO8601().withMessage('Valid registration deadline is required')
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

    // Validate dates
    const startDate = new Date(req.body.startDate);
    const endDate = new Date(req.body.endDate);
    const registrationDeadline = new Date(req.body.registrationDeadline);

    if (endDate <= startDate) {
      return res.status(400).json({
        success: false,
        message: 'End date must be after start date'
      });
    }

    if (registrationDeadline >= startDate) {
      return res.status(400).json({
        success: false,
        message: 'Registration deadline must be before event start date'
      });
    }

    const eventData = {
      ...req.body,
      createdBy: req.user._id,
      startDate,
      endDate,
      registrationDeadline
    };

    const event = new Event(eventData);
    await event.save();

    await event.populate('createdBy', 'name email');

    res.status(201).json({
      success: true,
      message: 'Event created successfully',
      event
    });

  } catch (error) {
    console.error('Create event error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Update event (Admin only)
router.put('/:id', auth, requireAdmin, [
  body('title').optional().trim().isLength({ min: 1 }).withMessage('Title cannot be empty'),
  body('description').optional().trim().isLength({ min: 1 }).withMessage('Description cannot be empty'),
  body('category').optional().isIn(['workshop', 'hackathon', 'tech-symposium', 'guest-lecture']).withMessage('Invalid category'),
  body('posterUrl').optional().isURL().withMessage('Valid poster URL is required'),
  body('startDate').optional().isISO8601().withMessage('Valid start date is required'),
  body('endDate').optional().isISO8601().withMessage('Valid end date is required'),
  body('registrationDeadline').optional().isISO8601().withMessage('Valid registration deadline is required')
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

    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    // Update fields
    Object.keys(req.body).forEach(key => {
      if (req.body[key] !== undefined) {
        event[key] = req.body[key];
      }
    });

    await event.save();
    await event.populate('createdBy', 'name email');

    res.json({
      success: true,
      message: 'Event updated successfully',
      event
    });

  } catch (error) {
    console.error('Update event error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Delete event (Admin only)
router.delete('/:id', auth, requireAdmin, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    // Check if there are registrations
    const registrationCount = await Registration.countDocuments({ event: event._id });
    if (registrationCount > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete event with existing registrations'
      });
    }

    await Event.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Event deleted successfully'
    });

  } catch (error) {
    console.error('Delete event error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Get events by category
router.get('/category/:category', [
  query('status').optional().isIn(['upcoming', 'ongoing', 'completed', 'cancelled'])
], async (req, res) => {
  try {
    const { category } = req.params;
    const { status } = req.query;

    if (!['workshop', 'hackathon', 'tech-symposium', 'guest-lecture'].includes(category)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid category'
      });
    }

    const query = { category };
    if (status) query.status = status;

    const events = await Event.find(query)
      .populate('createdBy', 'name email')
      .sort({ startDate: 1 });

    res.json({
      success: true,
      events,
      count: events.length
    });

  } catch (error) {
    console.error('Get events by category error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Get event registrations (Admin only)
router.get('/:id/registrations', auth, requireAdmin, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    const registrations = await Registration.getEventRegistrations(req.params.id);

    res.json({
      success: true,
      registrations,
      count: registrations.length,
      event: {
        id: event._id,
        title: event.title,
        maxParticipants: event.maxParticipants
      }
    });

  } catch (error) {
    console.error('Get event registrations error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router;