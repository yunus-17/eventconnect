// Test script to verify event creation and display
// This script can be run to test the event system

const Event = require('./models/Event');

async function testEventCreation() {
  try {
    console.log('🧪 Testing event creation and display...');
    
    // Create a test event
    const testEvent = new Event({
      title: 'Test Workshop - Web Development',
      description: 'A test workshop to verify the event system is working properly',
      category: 'workshop',
      domain: 'Web Development',
      posterUrl: 'https://via.placeholder.com/400x200/003366/ffffff?text=Test+Event',
      startDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      endDate: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000), // 8 days from now
      duration: '1 day',
      coordinatorName: 'Test Coordinator',
      coordinatorEmail: 'test@example.com',
      venue: 'Test Venue',
      maxParticipants: 50,
      registrationDeadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
      status: 'upcoming',
      createdBy: '507f1f77bcf86cd799439011' // Mock user ID
    });
    
    await testEvent.save();
    console.log('✅ Test event created successfully:', testEvent._id);
    
    // Fetch upcoming events
    const upcomingEvents = await Event.find({
      status: 'upcoming',
      startDate: { $gt: new Date() }
    }).sort({ startDate: 1 });
    
    console.log('📊 Found upcoming events:', upcomingEvents.length);
    upcomingEvents.forEach(event => {
      console.log(`  - ${event.title} (${event.category}) - ${event.startDate}`);
    });
    
    // Clean up test event
    await Event.findByIdAndDelete(testEvent._id);
    console.log('🧹 Test event cleaned up');
    
    console.log('✅ Event system test completed successfully!');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

// Export for use in other files
module.exports = { testEventCreation };

// Run test if this file is executed directly
if (require.main === module) {
  testEventCreation();
}
