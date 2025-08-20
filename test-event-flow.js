// Test script to verify the complete event flow from admin to user dashboard
const mongoose = require('mongoose');
require('dotenv').config({ path: './config.env' });

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/eventconnect', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const Event = require('./models/Event');

async function testEventFlow() {
  try {
    console.log('🧪 Testing Complete Event Flow');
    console.log('==============================');
    
    // Step 1: Check current events in database
    console.log('\n📊 Step 1: Checking current events in database...');
    const totalEvents = await Event.countDocuments();
    console.log(`Total events in database: ${totalEvents}`);
    
    if (totalEvents === 0) {
      console.log('❌ No events found! Please create events in admin dashboard first.');
      return;
    }
    
    // Step 2: Get all events
    const allEvents = await Event.find({}).sort({ createdAt: -1 });
    console.log('\n📋 All Events:');
    allEvents.forEach((event, index) => {
      console.log(`${index + 1}. ${event.title}`);
      console.log(`   Category: ${event.category}`);
      console.log(`   Status: ${event.status}`);
      console.log(`   Start Date: ${event.startDate}`);
      console.log(`   End Date: ${event.endDate}`);
      console.log(`   Is Main Event: ${event.isMainEvent}`);
      console.log(`   Main Event ID: ${event.mainEventId || 'None'}`);
      console.log('');
    });
    
    // Step 3: Check upcoming events (what user dashboard should show)
    console.log('🎯 Step 2: Checking upcoming events (user dashboard view)...');
    const now = new Date();
    const upcomingEvents = await Event.find({
      startDate: { $gt: now },
      status: { $ne: 'cancelled' }
    }).sort({ startDate: 1 });
    
    console.log(`Upcoming events found: ${upcomingEvents.length}`);
    if (upcomingEvents.length === 0) {
      console.log('⚠️ No upcoming events found! This is why user dashboard shows "No upcoming events"');
      console.log('💡 Possible reasons:');
      console.log('   - All events have past start dates');
      console.log('   - Events were created with past dates');
      console.log('   - Events are marked as cancelled');
    } else {
      upcomingEvents.forEach((event, index) => {
        console.log(`${index + 1}. ${event.title}`);
        console.log(`   Start: ${event.startDate}`);
        console.log(`   Status: ${event.status}`);
        console.log(`   Category: ${event.category}`);
      });
    }
    
    // Step 4: Check events by status
    console.log('\n📈 Step 3: Events by status...');
    const statusCounts = await Event.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);
    
    statusCounts.forEach(status => {
      console.log(`   ${status._id}: ${status.count}`);
    });
    
    // Step 5: Check main events and sub-events
    console.log('\n🏆 Step 4: Main events and sub-events...');
    const mainEvents = await Event.find({ isMainEvent: true });
    console.log(`Main events: ${mainEvents.length}`);
    
    mainEvents.forEach((mainEvent, index) => {
      console.log(`   ${index + 1}. ${mainEvent.title}`);
      console.log(`      ID: ${mainEvent._id}`);
    });
    
    const subEvents = await Event.find({ mainEventId: { $exists: true, $ne: null } });
    console.log(`Sub events: ${subEvents.length}`);
    
    subEvents.forEach((subEvent, index) => {
      console.log(`   ${index + 1}. ${subEvent.title}`);
      console.log(`      Main Event ID: ${subEvent.mainEventId}`);
    });
    
    // Step 6: Test API endpoints
    console.log('\n🌐 Step 5: Testing API endpoints...');
    const baseURL = 'http://localhost:4007';
    
    try {
      // Test GET /api/events
      console.log('Testing GET /api/events...');
      const response1 = await fetch(`${baseURL}/api/events`);
      if (response1.ok) {
        const data1 = await response1.json();
        console.log(`✅ Success: Found ${data1.events.length} total events`);
      } else {
        console.log(`❌ Failed: ${response1.status} ${response1.statusText}`);
      }
      
      // Test GET /api/events?status=upcoming
      console.log('Testing GET /api/events?status=upcoming...');
      const response2 = await fetch(`${baseURL}/api/events?status=upcoming`);
      if (response2.ok) {
        const data2 = await response2.json();
        console.log(`✅ Success: Found ${data2.events.length} upcoming events`);
        if (data2.events.length > 0) {
          console.log('   First upcoming event:', data2.events[0].title);
        }
      } else {
        console.log(`❌ Failed: ${response2.status} ${response2.statusText}`);
      }
      
    } catch (error) {
      console.log(`❌ API Test Error: ${error.message}`);
      console.log('💡 Make sure the server is running on port 4007');
    }
    
    // Step 7: Recommendations
    console.log('\n💡 Step 6: Recommendations...');
    if (upcomingEvents.length === 0) {
      console.log('🔧 To fix "No upcoming events" issue:');
      console.log('   1. Create events in admin dashboard with future dates');
      console.log('   2. Make sure startDate is in the future');
      console.log('   3. Check that events are not marked as cancelled');
      console.log('   4. Verify the server is running on port 4007');
    } else {
      console.log('✅ Events are properly configured!');
      console.log('   If user dashboard still shows "No upcoming events":');
      console.log('   1. Check browser console for JavaScript errors');
      console.log('   2. Verify API calls are working');
      console.log('   3. Check if user dashboard is calling the correct API endpoint');
    }
    
  } catch (error) {
    console.error('❌ Test Error:', error.message);
  } finally {
    mongoose.connection.close();
  }
}

// Run the test
testEventFlow();
