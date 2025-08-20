const express = require('express');
const { body, validationResult, query } = require('express-validator');
const Event = require('../models/Event');
const Registration = require('../models/Registration');
const { auth, requireAdmin, requireStudent } = require('../middleware/auth');

const router = express.Router();

// Helper function to update event statuses based on current date
async function updateEventStatuses() {
  const now = new Date();
  
  // Update ongoing events
  await Event.updateMany(
    {
      startDate: { $lte: now },
      endDate: { $gte: now },
      status: { $ne: 'ongoing' }
    },
    { status: 'ongoing' }
  );
  
  // Update completed events
  await Event.updateMany(
    {
      endDate: { $lt: now },
      status: { $nin: ['completed', 'cancelled'] }
    },
    { status: 'completed' }
  );
  
  // Update upcoming events (events that haven't started yet)
  await Event.updateMany(
    {
      startDate: { $gt: now },
      status: { $nin: ['upcoming', 'cancelled'] }
    },
    { status: 'upcoming' }
  );
}

// Get all events (public route with optional filtering)
router.get('/', [
  query('category').optional().isIn(['workshop', 'hackathon', 'tech-symposium', 'guest-lecture', 'main-event']),
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

    // Update event statuses before querying
    await updateEventStatuses();

    // Build query
    const query = {};
    if (category) query.category = category;
    
    // Handle status filtering with date-based logic
    if (status) {
      if (status === 'upcoming') {
        // For upcoming events, include events that haven't started yet
        query.startDate = { $gt: new Date() };
        query.status = { $ne: 'cancelled' };
      } else if (status === 'ongoing') {
        // For ongoing events, include events currently happening
        query.startDate = { $lte: new Date() };
        query.endDate = { $gte: new Date() };
        query.status = { $ne: 'cancelled' };
      } else if (status === 'completed') {
        // For completed events, include events that have ended
        query.endDate = { $lt: new Date() };
        query.status = { $ne: 'cancelled' };
      } else {
        // For cancelled events, use status directly
        query.status = status;
      }
    } else {
      // If no status specified, exclude cancelled events by default
      query.status = { $ne: 'cancelled' };
    }

    let events = await Event.find(query)
      .populate('createdBy', 'name email')
      .sort({ startDate: 1 })
      .limit(parseInt(limit))
      .skip(skip);
    
    // Populate sub-events for main events
    events = await Promise.all(events.map(async (event) => {
      if (event.isMainEvent) {
        const subEvents = await Event.find({ mainEventId: event._id })
          .select('title description startDate endDate venue maxParticipants subCategory')
          .sort({ startDate: 1 });
        event = event.toObject();
        event.subEvents = subEvents;
      }
      return event;
    }));

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
  body('category').isIn(['workshop', 'hackathon', 'tech-symposium', 'guest-lecture', 'main-event']).withMessage('Invalid category'),
  body('domain').trim().isLength({ min: 1 }).withMessage('Domain is required'),
  body('posterUrl').isURL().withMessage('Valid poster URL is required'),
  body('eventLink').optional().isURL().withMessage('Event link must be a valid URL'),
  body('googleFormLink').optional().isURL().withMessage('Google Form link must be a valid URL'),
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

    // Determine event status based on start date
    const now = new Date();
    let status = 'upcoming'; // Default status
    
    if (startDate <= now && endDate >= now) {
      status = 'ongoing';
    } else if (endDate < now) {
      status = 'completed';
    }

    const eventData = {
      ...req.body,
      createdBy: req.user._id,
      startDate,
      endDate,
      registrationDeadline,
      status
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
  body('eventLink').optional().isURL().withMessage('Event link must be a valid URL'),
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

// Get event registration analytics
router.get('/analytics', auth, requireAdmin, async (req, res) => {
  try {
    // Get all events with their registration counts
    const events = await Event.find({});
    
    // For each event, get the registration count
    const eventsWithRegistrations = await Promise.all(events.map(async (event) => {
      const registrationCount = await Registration.countDocuments({ 
        event: event._id, 
        status: { $in: ['registered', 'confirmed', 'attended'] }
      });
      
      return {
        id: event._id,
        name: event.title,
        category: event.category,
        date: event.startDate,
        registrations: registrationCount
      };
    }));
    
    res.json({
      success: true,
      data: eventsWithRegistrations
    });
    
  } catch (error) {
    console.error('Get analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Download event registrations as CSV
router.get('/:id/registrations/download', auth, async (req, res) => {
  try {
    const eventId = req.params.id;
    
    // Check if event exists
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }
    
    // Check if user is admin or event coordinator
    const isAdmin = req.user.role === 'admin';
    const isCoordinator = event.coordinators && event.coordinators.some(
      coord => coord.email === req.user.email
    );
    
    if (!isAdmin && !isCoordinator) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this resource'
      });
    }
    
    // Get all registrations for this event
    const registrations = await Registration.find({
      event: eventId,
      status: { $in: ['registered', 'confirmed', 'attended'] }
    }).populate('student', 'name email');
    
    // Check if there are any registrations
    if (registrations.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No registrations found for this event'
      });
    }
    
    // Prepare CSV data
    let csvData = 'Roll Number,Name,Email,Phone,Department,Year,Registration Date\n';
    
    registrations.forEach(reg => {
      const registrationDate = new Date(reg.registrationDate).toISOString().split('T')[0];
      
      csvData += `${reg.rollNumber},${reg.studentName},${reg.studentEmail},${reg.studentPhone},${reg.department},${reg.year},${registrationDate}\n`;
      
      // Add team members if it's a team registration
      if (reg.isTeamRegistration && reg.teamMembers && reg.teamMembers.length > 0) {
        reg.teamMembers.forEach(member => {
          csvData += `${member.rollNumber},${member.name},${member.email},${member.phone},${member.department},${member.year},${registrationDate} (Team Member)\n`;
        });
      }
    });
    
    // Set response headers for CSV download
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=registrations_${event.title.replace(/\s+/g, '_')}.csv`);
    
    // Send the CSV data
    res.send(csvData);
    
  } catch (error) {
    console.error('Download registrations error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Notification endpoint for new events (can be called by admin dashboard)
router.post('/notify-new-event', auth, requireAdmin, async (req, res) => {
  try {
    const { eventId, eventTitle } = req.body;
    
    if (!eventId || !eventTitle) {
      return res.status(400).json({
        success: false,
        message: 'Event ID and title are required'
      });
    }
    
    // In a real implementation, you would use WebSockets or Server-Sent Events
    // For now, we'll just log the notification
    console.log(`New event notification: ${eventTitle} (ID: ${eventId})`);
    
    // You could also store this in a notifications collection for users to fetch
    // For now, we'll return success so the admin dashboard knows the notification was sent
    
    res.json({
      success: true,
      message: 'Notification sent successfully',
      notification: {
        type: 'new_event',
        eventId,
        title: eventTitle,
        timestamp: new Date()
      }
    });
    
  } catch (error) {
    console.error('Notification error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Get recent notifications for users
router.get('/notifications/recent', auth, async (req, res) => {
  try {
    // In a real implementation, you would fetch from a notifications collection
    // For now, we'll return recent events as notifications
    const recentEvents = await Event.find({
      status: 'upcoming',
      startDate: { $gt: new Date() }
    })
    .sort({ createdAt: -1 })
    .limit(5)
    .select('title category startDate createdAt');
    
    const notifications = recentEvents.map(event => ({
      id: event._id,
      type: 'new_event',
      title: `New ${event.category.replace('-', ' ')}: ${event.title}`,
      message: `A new ${event.category.replace('-', ' ')} has been added`,
      timestamp: event.createdAt,
      eventId: event._id
    }));
    
    res.json({
      success: true,
      notifications
    });
    
  } catch (error) {
    console.error('Get notifications error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Test endpoint to create a sample event (for testing purposes)
router.post('/test/create-sample', async (req, res) => {
  try {
    const sampleEvent = new Event({
      title: 'Sample Workshop - AI & Machine Learning',
      description: 'This is a sample event created for testing the event system. Learn about AI and Machine Learning fundamentals.',
      category: 'workshop',
      domain: 'Artificial Intelligence',
      posterUrl: 'https://via.placeholder.com/400x200/003366/ffffff?text=AI+Workshop',
      startDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
      endDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000), // 4 days from now
      duration: '1 day',
      coordinatorName: 'Sample Coordinator',
      coordinatorEmail: 'sample@example.com',
      venue: 'Computer Lab 101',
      maxParticipants: 30,
      registrationDeadline: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
      status: 'upcoming',
      createdBy: '507f1f77bcf86cd799439011' // Mock user ID
    });
    
    await sampleEvent.save();
    
    res.json({
      success: true,
      message: 'Sample event created successfully',
      event: sampleEvent
    });
    
  } catch (error) {
    console.error('Create sample event error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router;