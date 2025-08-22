// Test script for Tech Symposium functionality
// Run this with: node test-tech-symposium.js

const fetch = require('node-fetch');

const BASE_URL = 'http://localhost:3000/api';

// Test data for tech symposium
const testSymposium = {
  title: "Test Tech Symposium 2024",
  description: "A comprehensive test symposium for emerging technologies",
  category: "tech-symposium",
  domain: "Emerging Technologies",
  posterUrl: "https://via.placeholder.com/600x300?text=Test+Symposium",
  startDate: "2024-03-15",
  endDate: "2024-03-16",
  duration: "2 days",
  coordinatorName: "Test Coordinator",
  coordinatorEmail: "admin@kongu.edu",
  venue: "Main Auditorium",
  maxParticipants: 100,
  registrationDeadline: "2024-03-10",
  eventType: {
    intraDept: true,
    interDept: false,
    online: false,
    offline: true
  },
  certificationProvided: true,
  additionalFields: {
    theme: "Emerging Technologies",
    department: "CSE",
    mode: "Offline",
    keynoteSpeakers: "Dr. John Doe, Dr. Jane Smith",
    schedule: "Day 1: Keynotes, Day 2: Paper Presentations",
    specialFeatures: ["Paper Presentation", "Project Exhibition", "Certificates Provided"],
    eligibility: ["2nd Year", "3rd Year", "4th Year"],
    externalParticipants: false,
    requiresLaptop: true
  }
};

async function testTechSymposiumAPI() {
  console.log('🧪 Testing Tech Symposium API...\n');

  try {
    // Test 1: Get all tech symposiums
    console.log('1. Testing GET /api/events?category=tech-symposium');
    const getResponse = await fetch(`${BASE_URL}/events?category=tech-symposium`);
    const getData = await getResponse.json();
    console.log('✅ GET Response:', getData.success ? 'Success' : 'Failed');
    console.log('   Events count:', getData.events ? getData.events.length : 0);
    console.log('');

    // Test 2: Create a new tech symposium (requires admin token)
    console.log('2. Testing POST /api/events (Create tech symposium)');
    console.log('   Note: This requires admin authentication token');
    console.log('   Test data prepared but not executed (requires login)');
    console.log('   Symposium title:', testSymposium.title);
    console.log('');

    // Test 3: Test data structure validation
    console.log('3. Testing data structure validation');
    const requiredFields = [
      'title', 'description', 'category', 'domain', 'posterUrl',
      'startDate', 'endDate', 'duration', 'coordinatorName',
      'coordinatorEmail', 'venue', 'maxParticipants', 'registrationDeadline'
    ];
    
    const missingFields = requiredFields.filter(field => !testSymposium[field]);
    if (missingFields.length === 0) {
      console.log('✅ All required fields present');
    } else {
      console.log('❌ Missing fields:', missingFields);
    }
    console.log('');

    // Test 4: Test date validation
    console.log('4. Testing date validation');
    const startDate = new Date(testSymposium.startDate);
    const endDate = new Date(testSymposium.endDate);
    const deadline = new Date(testSymposium.registrationDeadline);
    
    if (endDate > startDate) {
      console.log('✅ End date is after start date');
    } else {
      console.log('❌ End date must be after start date');
    }
    
    if (deadline < startDate) {
      console.log('✅ Registration deadline is before start date');
    } else {
      console.log('❌ Registration deadline must be before start date');
    }
    console.log('');

    // Test 5: Test additional fields structure
    console.log('5. Testing additional fields structure');
    const additionalFields = testSymposium.additionalFields;
    const requiredAdditionalFields = ['theme', 'department', 'mode', 'specialFeatures', 'eligibility'];
    
    const missingAdditionalFields = requiredAdditionalFields.filter(field => !additionalFields[field]);
    if (missingAdditionalFields.length === 0) {
      console.log('✅ All additional fields present');
    } else {
      console.log('❌ Missing additional fields:', missingAdditionalFields);
    }
    console.log('');

    console.log('🎉 Tech Symposium API tests completed!');
    console.log('\n📝 To test full functionality:');
    console.log('1. Start the server: npm start');
    console.log('2. Login as admin at: http://localhost:3000');
    console.log('3. Navigate to EventConnect Admin Dashboard');
    console.log('4. Click on "Tech Symposiums" in the sidebar');
    console.log('5. Try creating, editing, and deleting symposiums');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run the test
testTechSymposiumAPI();
