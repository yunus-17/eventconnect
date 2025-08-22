const testGuestLecture = {
  title: "Advanced Machine Learning Applications",
  description: "An in-depth lecture on cutting-edge machine learning techniques and their real-world applications in industry.",
  category: "guest-lecture",
  domain: "Machine Learning & AI",
  posterUrl: "https://via.placeholder.com/600x300?text=Guest+Lecture+ML",
  startDate: "2024-03-15",
  endDate: "2024-03-15",
  duration: "1 day",
  coordinatorName: "Dr. Sarah Johnson",
  coordinatorEmail: "admin@kongu.edu",
  venue: "Main Auditorium",
  maxParticipants: 200,
  registrationDeadline: "2024-03-10",
  eventType: { 
    intraDept: true, 
    interDept: false, 
    online: false, 
    offline: true 
  },
  certificationProvided: true,
  additionalFields: {
    speakerName: "Dr. Michael Chen",
    speakerDesignation: "Senior Research Scientist, Google AI",
    lectureTopic: "Advanced Machine Learning Applications",
    startTime: "14:00",
    endTime: "16:00",
    mode: "Offline",
    mandatoryForAll: false,
    selectedYears: ["3rd Year", "4th Year"],
    specialRequirements: ["Bring Laptop"],
    coordinatorContact: "9876543210"
  }
};

// Test GET request for guest lectures
async function testGetGuestLectures() {
  try {
    console.log('Testing GET /api/events?category=guest-lecture...');
    const response = await fetch('http://localhost:3000/api/events?category=guest-lecture');
    const data = await response.json();
    
    if (response.ok) {
      console.log('✅ GET request successful');
      console.log('Found', data.events?.length || 0, 'guest lectures');
      if (data.events && data.events.length > 0) {
        console.log('Sample guest lecture:', {
          title: data.events[0].title,
          speaker: data.events[0].additionalFields?.speakerName,
          date: data.events[0].startDate
        });
      }
    } else {
      console.log('❌ GET request failed:', data.message);
    }
  } catch (error) {
    console.log('❌ GET request error:', error.message);
  }
}

// Validate test data structure
function validateTestData() {
  console.log('Validating test guest lecture data...');
  
  const requiredFields = ['title', 'description', 'category', 'domain', 'startDate', 'endDate'];
  const missingFields = requiredFields.filter(field => !testGuestLecture[field]);
  
  if (missingFields.length > 0) {
    console.log('❌ Missing required fields:', missingFields);
    return false;
  }
  
  // Validate dates
  const startDate = new Date(testGuestLecture.startDate);
  const endDate = new Date(testGuestLecture.endDate);
  const deadline = new Date(testGuestLecture.registrationDeadline);
  
  if (startDate > endDate) {
    console.log('❌ End date must be after start date');
    return false;
  }
  
  if (deadline >= startDate) {
    console.log('❌ Registration deadline must be before lecture date');
    return false;
  }
  
  // Validate additional fields
  const additionalFields = testGuestLecture.additionalFields;
  if (!additionalFields.speakerName || !additionalFields.speakerDesignation) {
    console.log('❌ Speaker information is required');
    return false;
  }
  
  if (!additionalFields.startTime || !additionalFields.endTime) {
    console.log('❌ Lecture timing is required');
    return false;
  }
  
  if (additionalFields.startTime >= additionalFields.endTime) {
    console.log('❌ End time must be after start time');
    return false;
  }
  
  console.log('✅ Test data validation passed');
  return true;
}

// Run tests
async function runTests() {
  console.log('🧪 Testing Guest Lecture API Endpoints\n');
  
  // Validate test data first
  if (!validateTestData()) {
    console.log('\n❌ Test data validation failed. Please fix the issues above.');
    return;
  }
  
  // Test GET endpoint
  await testGetGuestLectures();
  
  console.log('\n📝 Manual Testing Instructions:');
  console.log('1. Start the server: npm start');
  console.log('2. Open eventconnect-admin.html in your browser');
  console.log('3. Navigate to "Guest Lectures" section');
  console.log('4. Try adding a new guest lecture using the form');
  console.log('5. Verify the data is saved to MongoDB Atlas');
  console.log('6. Test edit and delete functionality');
  
  console.log('\n📊 Expected Guest Lecture Data Structure:');
  console.log(JSON.stringify(testGuestLecture, null, 2));
}

// Run tests if this file is executed directly
if (require.main === module) {
  runTests();
}

module.exports = { testGuestLecture, testGetGuestLectures, validateTestData };
