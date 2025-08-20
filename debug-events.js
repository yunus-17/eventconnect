// Debug script to check events in database and test API endpoints
const mongoose = require('mongoose');
require('dotenv').config({ path: './config.env' });

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/eventconnect', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const Event = require('./models/Event');

async function debugEvents() {
  try {
    console.log('🔍 Debugging Events in Database');
    console.log('================================');
    
    // Check total events
    const totalEvents = await Event.countDocuments();
    console.log(`📊 Total events in database: ${totalEvents}`);
    
    if (totalEvents === 0) {
      console.log('❌ No events found in database!');
      console.log('💡 You need to create events in the admin dashboard first.');
      return;
    }
    
    // Get all events
    const allEvents = await Event.find({}).sort({ createdAt: -1 });
    console.log('\n📋 All Events:');
    allEvents.forEach((event, index) => {
      console.log(`${index + 1}. ${event.title}`);
      console.log(`   Category: ${event.category}`);
      console.log(`   Status: ${event.status}`);
      console.log(`   Start Date: ${event.startDate}`);
      console.log(`   End Date: ${event.endDate}`);
      console.log(`   Created: ${event.createdAt}`);
      console.log('');
    });
    
    // Check upcoming events (based on date)
    const now = new Date();
    const upcomingEvents = await Event.find({
      startDate: { $gt: now },
      status: { $ne: 'cancelled' }
    }).sort({ startDate: 1 });
    
    console.log(`🎯 Upcoming Events (${upcomingEvents.length}):`);
    if (upcomingEvents.length === 0) {
      console.log('❌ No upcoming events found!');
      console.log('💡 This could be because:');
      console.log('   - All events have past start dates');
      console.log('   - Events are marked as cancelled');
      console.log('   - Events were created with past dates');
    } else {
      upcomingEvents.forEach((event, index) => {
        console.log(`${index + 1}. ${event.title}`);
        console.log(`   Start: ${event.startDate}`);
        console.log(`   Status: ${event.status}`);
        console.log('');
      });
    }
    
    // Check events by status
    const statusCounts = await Event.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);
    
    console.log('📈 Events by Status:');
    statusCounts.forEach(status => {
      console.log(`   ${status._id}: ${status.count}`);
    });
    
    // Check recent events (created in last 24 hours)
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const recentEvents = await Event.find({
      createdAt: { $gte: yesterday }
    }).sort({ createdAt: -1 });
    
    console.log(`\n🆕 Recent Events (last 24 hours): ${recentEvents.length}`);
    recentEvents.forEach((event, index) => {
      console.log(`${index + 1}. ${event.title} (${event.createdAt})`);
    });
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    mongoose.connection.close();
  }
}

// Test API endpoints
async function testAPIEndpoints() {
  console.log('\n🌐 Testing API Endpoints');
  console.log('========================');
  
  const baseURL = 'http://localhost:4007';
  
  try {
    // Test 1: Get all events
    console.log('\n1️⃣ Testing GET /api/events');
    const response1 = await fetch(`${baseURL}/api/events`);
    if (response1.ok) {
      const data1 = await response1.json();
      console.log(`✅ Success: Found ${data1.events.length} events`);
    } else {
      console.log(`❌ Failed: ${response1.status} ${response1.statusText}`);
    }
    
    // Test 2: Get upcoming events
    console.log('\n2️⃣ Testing GET /api/events?status=upcoming');
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
    
    // Test 3: Get notifications
    console.log('\n3️⃣ Testing GET /api/events/notifications/recent');
    const response3 = await fetch(`${baseURL}/api/events/notifications/recent`);
    if (response3.ok) {
      const data3 = await response3.json();
      console.log(`✅ Success: Found ${data3.notifications.length} notifications`);
    } else {
      console.log(`❌ Failed: ${response3.status} ${response3.statusText}`);
    }
    
  } catch (error) {
    console.log(`❌ API Test Error: ${error.message}`);
    console.log('💡 Make sure the server is running on port 4007');
  }
}

// Run both functions
async function runDebug() {
  await debugEvents();
  await testAPIEndpoints();
  
  console.log('\n🏁 Debug completed!');
  console.log('\n📝 Next Steps:');
  console.log('1. If no events found: Create events in admin dashboard');
  console.log('2. If events exist but not showing: Check dates and status');
  console.log('3. If API fails: Check if server is running');
  console.log('4. If still issues: Check browser console for errors');
}

// Run if this script is executed directly
if (require.main === module) {
  runDebug();
}

module.exports = { debugEvents, testAPIEndpoints };
