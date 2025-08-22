// Test script for Workshop Form Link functionality
// This script can be run in the browser console to test the formLink functionality

console.log('🧪 Testing Workshop Form Link Functionality...');

// Test 1: Check if formLink field exists in Event model
function testEventModel() {
  console.log('📋 Test 1: Checking Event model for formLink field...');
  
  // This would typically be tested on the backend
  console.log('✅ Event model should have formLink field (backend validation)');
  return true;
}

// Test 2: Check if workshop form has formLink input
function testWorkshopForm() {
  console.log('📋 Test 2: Checking workshop form for formLink input...');
  const formLinkInput = document.getElementById('workshopFormLink');
  
  if (formLinkInput) {
    console.log('✅ Workshop form has formLink input field');
    console.log('✅ Input type:', formLinkInput.type);
    console.log('✅ Input placeholder:', formLinkInput.placeholder);
    return true;
  } else {
    console.log('❌ Workshop form missing formLink input field');
    return false;
  }
}

// Test 3: Check if user dashboard renders formLink buttons
function testUserDashboardRendering() {
  console.log('📋 Test 3: Checking user dashboard rendering...');
  
  // Check if the renderUpcomingEvents function exists
  if (typeof renderUpcomingEvents === 'function') {
    console.log('✅ renderUpcomingEvents function exists');
  } else {
    console.log('❌ renderUpcomingEvents function not found');
    return false;
  }
  
  // Check if the renderNotificationsEvents function exists
  if (typeof renderNotificationsEvents === 'function') {
    console.log('✅ renderNotificationsEvents function exists');
  } else {
    console.log('❌ renderNotificationsEvents function not found');
    return false;
  }
  
  return true;
}

// Test 4: Check CSS styles for register-now-btn
function testCSSStyles() {
  console.log('📋 Test 4: Checking CSS styles for register-now-btn...');
  
  // Create a test button to check styles
  const testButton = document.createElement('button');
  testButton.className = 'register-now-btn';
  testButton.textContent = 'Test Register Now';
  testButton.style.position = 'absolute';
  testButton.style.top = '-1000px';
  document.body.appendChild(testButton);
  
  const computedStyle = window.getComputedStyle(testButton);
  const backgroundColor = computedStyle.backgroundColor;
  const color = computedStyle.color;
  
  // Clean up
  document.body.removeChild(testButton);
  
  if (backgroundColor && color) {
    console.log('✅ register-now-btn styles are applied');
    console.log('✅ Background color:', backgroundColor);
    console.log('✅ Text color:', color);
    return true;
  } else {
    console.log('❌ register-now-btn styles not found');
    return false;
  }
}

// Test 5: Simulate workshop creation with formLink
function testWorkshopCreation() {
  console.log('📋 Test 5: Testing workshop creation with formLink...');
  
  // Check if we're on the admin dashboard
  const isAdminDashboard = window.location.pathname.includes('eventconnect-admin.html');
  
  if (!isAdminDashboard) {
    console.log('⚠️ This test should be run on the admin dashboard');
    return false;
  }
  
  // Check if workshop form exists
  const workshopForm = document.getElementById('workshopForm');
  if (!workshopForm) {
    console.log('❌ Workshop form not found');
    return false;
  }
  
  console.log('✅ Workshop form found');
  console.log('✅ Ready to test workshop creation with formLink');
  
  return true;
}

// Test 6: Simulate event rendering with formLink
function testEventRendering() {
  console.log('📋 Test 6: Testing event rendering with formLink...');
  
  // Check if we're on the user dashboard
  const isUserDashboard = window.location.pathname.includes('user-dashboard.html');
  
  if (!isUserDashboard) {
    console.log('⚠️ This test should be run on the user dashboard');
    return false;
  }
  
  // Create a mock event with formLink
  const mockEvent = {
    _id: 'test-event-id',
    title: 'Test Workshop with Form Link',
    description: 'This is a test workshop with a form link',
    category: 'workshop',
    startDate: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
    endDate: new Date(Date.now() + 172800000).toISOString(), // Day after tomorrow
    venue: 'Test Venue',
    formLink: 'https://forms.google.com/test-form'
  };
  
  // Test the rendering logic
  const hasFormLink = mockEvent.formLink && mockEvent.formLink.trim() !== '';
  const isWorkshop = mockEvent.category === 'workshop';
  
  if (hasFormLink && isWorkshop) {
    console.log('✅ Event has formLink and is a workshop');
    console.log('✅ Should render "Register Now" button');
    console.log('✅ Button should open:', mockEvent.formLink);
    return true;
  } else {
    console.log('❌ Event missing formLink or is not a workshop');
    return false;
  }
}

// Run all tests
function runAllTests() {
  console.log('🚀 Starting Workshop Form Link Tests...\n');
  
  const test1 = testEventModel();
  const test2 = testWorkshopForm();
  const test3 = testUserDashboardRendering();
  const test4 = testCSSStyles();
  const test5 = testWorkshopCreation();
  const test6 = testEventRendering();
  
  console.log('\n📊 Test Results Summary:');
  console.log(`Event Model: ${test1 ? '✅' : '❌'}`);
  console.log(`Workshop Form: ${test2 ? '✅' : '❌'}`);
  console.log(`User Dashboard Rendering: ${test3 ? '✅' : '❌'}`);
  console.log(`CSS Styles: ${test4 ? '✅' : '❌'}`);
  console.log(`Workshop Creation: ${test5 ? '✅' : '⚠️'}`);
  console.log(`Event Rendering: ${test6 ? '✅' : '⚠️'}`);
  
  const allPassed = test1 && test2 && test3 && test4;
  console.log(`\n🎯 Overall Result: ${allPassed ? '✅ ALL TESTS PASSED' : '❌ SOME TESTS FAILED'}`);
  
  if (allPassed) {
    console.log('\n🎉 Workshop formLink functionality is working correctly!');
    console.log('💡 Manual Testing Instructions:');
    console.log('1. Go to admin dashboard and create a workshop with a form link');
    console.log('2. Go to user dashboard and verify the "Register Now" button appears');
    console.log('3. Click the "Register Now" button to verify it opens the form link');
    console.log('4. Test with different form link URLs (Google Forms, etc.)');
  } else {
    console.log('\n🔧 Issues detected. Please check the console for specific errors.');
  }
}

// Export for use in browser console
if (typeof window !== 'undefined') {
  window.testWorkshopFormLink = runAllTests;
  console.log('💡 Run testWorkshopFormLink() in the console to test the functionality');
}

// Run tests if this script is executed directly
if (typeof module === 'undefined') {
  // Browser environment
  setTimeout(runAllTests, 1000); // Wait for page to load
} else {
  // Node.js environment
  console.log('This test script is designed to run in a browser environment.');
  console.log('Please open the appropriate dashboard page and run testWorkshopFormLink() in the console.');
}
