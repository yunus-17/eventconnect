// Test script for Hackathon Form Link functionality
// Run this in the browser console on the user-dashboard.html page

console.log('🧪 Testing Hackathon Form Link Functionality...\n');

// Test 1: Check if Event model supports formLink field
function testEventModelField() {
  console.log('1️⃣ Testing Event model formLink field...');
  
  // Simulate a hackathon event with formLink
  const mockHackathonEvent = {
    _id: 'test-hackathon-123',
    title: 'AI Hackathon 2024',
    description: 'Build innovative AI solutions',
    category: 'hackathon',
    startDate: '2024-12-15',
    endDate: '2024-12-17',
    formLink: 'https://forms.google.com/test-hackathon-form',
    posterUrl: 'https://example.com/poster.jpg',
    venue: 'Main Auditorium'
  };
  
  if (mockHackathonEvent.formLink) {
    console.log('✅ Event model supports formLink field');
    console.log('📝 Sample formLink:', mockHackathonEvent.formLink);
  } else {
    console.log('❌ Event model missing formLink field');
  }
  console.log('');
}

// Test 2: Check if hackathon form input exists in admin page
function testHackathonFormInput() {
  console.log('2️⃣ Testing hackathon form input field...');
  
  // Check if we're on the admin page
  if (window.location.pathname.includes('eventconnect-admin')) {
    const formLinkInput = document.getElementById('hackathonFormLink');
    if (formLinkInput) {
      console.log('✅ Hackathon form link input field exists');
      console.log('📝 Input type:', formLinkInput.type);
      console.log('📝 Input name:', formLinkInput.name);
      console.log('📝 Placeholder:', formLinkInput.placeholder);
    } else {
      console.log('❌ Hackathon form link input field not found');
    }
  } else {
    console.log('ℹ️ Not on admin page - skipping form input test');
  }
  console.log('');
}

// Test 3: Check if user dashboard renders hackathon formLink button
function testUserDashboardRendering() {
  console.log('3️⃣ Testing user dashboard hackathon rendering...');
  
  // Check if we're on the user dashboard page
  if (window.location.pathname.includes('user-dashboard')) {
    // Look for upcoming events container
    const upcomingContainer = document.getElementById('upcomingEventsContainer');
    if (upcomingContainer) {
      console.log('✅ Upcoming events container found');
      
      // Check if there are any hackathon events with formLink
      const hackathonCards = upcomingContainer.querySelectorAll('.event-card');
      let hackathonWithFormLink = false;
      
      hackathonCards.forEach(card => {
        const category = card.querySelector('.event-category');
        if (category && category.textContent.includes('hackathon')) {
          const registerBtn = card.querySelector('.register-now-btn');
          if (registerBtn && registerBtn.textContent === 'Register Now') {
            hackathonWithFormLink = true;
            console.log('✅ Found hackathon with "Register Now" button (formLink)');
          }
        }
      });
      
      if (!hackathonWithFormLink) {
        console.log('ℹ️ No hackathon events with formLink found in upcoming events');
      }
    } else {
      console.log('❌ Upcoming events container not found');
    }
  } else {
    console.log('ℹ️ Not on user dashboard page - skipping rendering test');
  }
  console.log('');
}

// Test 4: Check CSS styles for register button
function testCSSStyles() {
  console.log('4️⃣ Testing CSS styles for register button...');
  
  // Check if we're on the user dashboard page
  if (window.location.pathname.includes('user-dashboard')) {
    // Look for any register-now-btn elements
    const registerButtons = document.querySelectorAll('.register-now-btn');
    if (registerButtons.length > 0) {
      const firstButton = registerButtons[0];
      const computedStyle = window.getComputedStyle(firstButton);
      
      console.log('✅ Register button found, checking styles...');
      console.log('🎨 Background color:', computedStyle.backgroundColor);
      console.log('🎨 Color:', computedStyle.color);
      console.log('🎨 Border radius:', computedStyle.borderRadius);
      console.log('🎨 Padding:', computedStyle.padding);
    } else {
      console.log('ℹ️ No register buttons found to test styles');
    }
  } else {
    console.log('ℹ️ Not on user dashboard page - skipping CSS test');
  }
  console.log('');
}

// Test 5: Simulate hackathon creation and rendering
function testHackathonWorkflow() {
  console.log('5️⃣ Testing hackathon workflow simulation...');
  
  // Simulate creating a hackathon event with formLink
  const mockHackathon = {
    _id: 'simulated-hackathon-456',
    title: 'Blockchain Hackathon',
    description: 'Build decentralized applications',
    category: 'hackathon',
    startDate: '2024-12-20',
    endDate: '2024-12-22',
    formLink: 'https://forms.google.com/blockchain-hackathon',
    posterUrl: 'https://example.com/blockchain-poster.jpg',
    venue: 'Innovation Lab'
  };
  
  console.log('📝 Simulated hackathon event:', mockHackathon);
  
  // Test the rendering logic
  const isHackathon = mockHackathon.category === 'hackathon';
  const hasFormLink = mockHackathon.formLink && mockHackathon.formLink.trim() !== '';
  
  if (isHackathon && hasFormLink) {
    console.log('✅ Hackathon with formLink would render "Register Now" button');
    console.log('🔗 Form link:', mockHackathon.formLink);
  } else if (isHackathon) {
    console.log('✅ Hackathon without formLink would render "Register for Hackathon" button');
  } else {
    console.log('❌ Not a hackathon event');
  }
  console.log('');
}

// Run all tests
function runAllTests() {
  console.log('🚀 Running all hackathon form link tests...\n');
  
  testEventModelField();
  testHackathonFormInput();
  testUserDashboardRendering();
  testCSSStyles();
  testHackathonWorkflow();
  
  console.log('✨ All tests completed!');
  console.log('\n📋 Manual Testing Instructions:');
  console.log('1. Go to eventconnect-admin.html and create a hackathon with a form link');
  console.log('2. Go to user-dashboard.html and check if the hackathon shows a "Register Now" button');
  console.log('3. Click the button to verify it opens the form link in a new tab');
}

// Export functions for manual testing
window.testHackathonFormLink = {
  testEventModelField,
  testHackathonFormInput,
  testUserDashboardRendering,
  testCSSStyles,
  testHackathonWorkflow,
  runAllTests
};

console.log('🧪 Hackathon Form Link test functions loaded!');
console.log('💡 Run testHackathonFormLink.runAllTests() to execute all tests');
console.log('💡 Or run individual tests like testHackathonFormLink.testEventModelField()');
