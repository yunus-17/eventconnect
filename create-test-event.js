// Script to create a test event for debugging
const mongoose = require('mongoose');
require('dotenv').config({ path: './config.env' });

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/eventconnect', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const Event = require('./models/Event');

async function createTestEvent() {
  try {
    console.log('🧪 Creating Test Event');
    console.log('=====================');
    
    // Create a test event with future dates
    const testEvent = new Event({
      title: "Test Workshop - " + new Date().toISOString(),
      description: "This is a test workshop to verify the event flow from admin to user dashboard",
      category: "workshop",
      domain: "Testing",
      posterUrl: "https://example.com/test-poster.jpg",
      startDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      endDate: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000), // 8 days from now
      duration: "1 day",
      coordinatorName: "Test Coordinator",
      coordinatorEmail: "test@example.com",
      venue: "Test Venue",
      maxParticipants: 50,
      registrationDeadline: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000), // 6 days from now
      status: "upcoming",
      createdBy: "test-admin" // You might need to adjust this based on your User model
    });
    
    await testEvent.save();
    console.log('✅ Test event created successfully!');
    console.log('📋 Event details:');
    console.log(`   Title: ${testEvent.title}`);
    console.log(`   Category: ${testEvent.category}`);
    console.log(`   Status: ${testEvent.status}`);
    console.log(`   Start Date: ${testEvent.startDate}`);
    console.log(`   End Date: ${testEvent.endDate}`);
    
    // Verify the event is in the database
    const savedEvent = await Event.findById(testEvent._id);
    if (savedEvent) {
      console.log('✅ Event saved and retrieved successfully!');
    } else {
      console.log('❌ Event not found in database!');
    }
    
    // Check upcoming events
    const now = new Date();
    const upcomingEvents = await Event.find({
      startDate: { $gt: now },
      status: { $ne: 'cancelled' }
    });
    
    console.log(`\n🎯 Total upcoming events: ${upcomingEvents.length}`);
    upcomingEvents.forEach((event, index) => {
      console.log(`${index + 1}. ${event.title} (${event.startDate})`);
    });
    
  } catch (error) {
    console.error('❌ Error creating test event:', error.message);
  } finally {
    mongoose.connection.close();
  }
}

// Run the function
createTestEvent();
