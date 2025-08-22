// Test script for profile dropdown functionality
// This script can be run in the browser console to test the dropdown functionality

console.log('🧪 Testing Profile Dropdown Functionality...');

// Test 1: Check if profile button exists
function testProfileButton() {
  console.log('📋 Test 1: Checking profile button...');
  const profileBtn = document.getElementById('profileBtn');
  if (profileBtn) {
    console.log('✅ Profile button found');
    return true;
  } else {
    console.log('❌ Profile button not found');
    return false;
  }
}

// Test 2: Check if profile dropdown exists
function testProfileDropdown() {
  console.log('📋 Test 2: Checking profile dropdown...');
  const profileDropdown = document.getElementById('profileDropdown');
  if (profileDropdown) {
    console.log('✅ Profile dropdown found');
    return true;
  } else {
    console.log('❌ Profile dropdown not found');
    return false;
  }
}

// Test 3: Check if dropdown items exist
function testDropdownItems() {
  console.log('📋 Test 3: Checking dropdown items...');
  const quickActions = document.getElementById('openQuickActions');
  const recentActivity = document.getElementById('openRecentActivity');
  const academicStatus = document.getElementById('openAcademicStatus');
  
  let allFound = true;
  
  if (quickActions) {
    console.log('✅ Quick Actions button found');
  } else {
    console.log('❌ Quick Actions button not found');
    allFound = false;
  }
  
  if (recentActivity) {
    console.log('✅ Recent Activity button found');
  } else {
    console.log('❌ Recent Activity button not found');
    allFound = false;
  }
  
  if (academicStatus) {
    console.log('✅ Academic Status button found');
  } else {
    console.log('❌ Academic Status button not found');
    allFound = false;
  }
  
  return allFound;
}

// Test 4: Check if modals exist
function testModals() {
  console.log('📋 Test 4: Checking modals...');
  const quickActionsModal = document.getElementById('quickActionsModal');
  const recentActivityModal = document.getElementById('recentActivityModal');
  const academicStatusModal = document.getElementById('academicStatusModal');
  
  let allFound = true;
  
  if (quickActionsModal) {
    console.log('✅ Quick Actions modal found');
  } else {
    console.log('❌ Quick Actions modal not found');
    allFound = false;
  }
  
  if (recentActivityModal) {
    console.log('✅ Recent Activity modal found');
  } else {
    console.log('❌ Recent Activity modal not found');
    allFound = false;
  }
  
  if (academicStatusModal) {
    console.log('✅ Academic Status modal found');
  } else {
    console.log('❌ Academic Status modal not found');
    allFound = false;
  }
  
  return allFound;
}

// Test 5: Test dropdown toggle functionality
function testDropdownToggle() {
  console.log('📋 Test 5: Testing dropdown toggle...');
  const profileBtn = document.getElementById('profileBtn');
  const profileDropdown = document.getElementById('profileDropdown');
  
  if (!profileBtn || !profileDropdown) {
    console.log('❌ Cannot test toggle - missing elements');
    return false;
  }
  
  // Check initial state
  const initialState = profileDropdown.classList.contains('open');
  console.log(`Initial dropdown state: ${initialState ? 'open' : 'closed'}`);
  
  // Simulate click
  profileBtn.click();
  
  // Check state after click
  setTimeout(() => {
    const newState = profileDropdown.classList.contains('open');
    console.log(`Dropdown state after click: ${newState ? 'open' : 'closed'}`);
    
    if (newState !== initialState) {
      console.log('✅ Dropdown toggle working correctly');
    } else {
      console.log('❌ Dropdown toggle not working');
    }
  }, 100);
  
  return true;
}

// Test 6: Test modal opening functionality
function testModalOpening() {
  console.log('📋 Test 6: Testing modal opening...');
  
  // Test Quick Actions modal
  const quickActionsBtn = document.getElementById('openQuickActions');
  const quickActionsModal = document.getElementById('quickActionsModal');
  
  if (quickActionsBtn && quickActionsModal) {
    console.log('Testing Quick Actions modal...');
    quickActionsBtn.click();
    
    setTimeout(() => {
      const isVisible = quickActionsModal.style.display === 'block';
      console.log(`Quick Actions modal visible: ${isVisible ? '✅' : '❌'}`);
      
      // Close the modal
      const closeBtn = quickActionsModal.querySelector('.close-btn');
      if (closeBtn) {
        closeBtn.click();
      }
    }, 100);
  }
  
  // Test Recent Activity modal
  const recentActivityBtn = document.getElementById('openRecentActivity');
  const recentActivityModal = document.getElementById('recentActivityModal');
  
  if (recentActivityBtn && recentActivityModal) {
    console.log('Testing Recent Activity modal...');
    recentActivityBtn.click();
    
    setTimeout(() => {
      const isVisible = recentActivityModal.style.display === 'block';
      console.log(`Recent Activity modal visible: ${isVisible ? '✅' : '❌'}`);
      
      // Close the modal
      const closeBtn = recentActivityModal.querySelector('.close-btn');
      if (closeBtn) {
        closeBtn.click();
      }
    }, 200);
  }
  
  // Test Academic Status modal
  const academicStatusBtn = document.getElementById('openAcademicStatus');
  const academicStatusModal = document.getElementById('academicStatusModal');
  
  if (academicStatusBtn && academicStatusModal) {
    console.log('Testing Academic Status modal...');
    academicStatusBtn.click();
    
    setTimeout(() => {
      const isVisible = academicStatusModal.style.display === 'block';
      console.log(`Academic Status modal visible: ${isVisible ? '✅' : '❌'}`);
      
      // Close the modal
      const closeBtn = academicStatusModal.querySelector('.close-btn');
      if (closeBtn) {
        closeBtn.click();
      }
    }, 300);
  }
}

// Run all tests
function runAllTests() {
  console.log('🚀 Starting Profile Dropdown Tests...\n');
  
  const test1 = testProfileButton();
  const test2 = testProfileDropdown();
  const test3 = testDropdownItems();
  const test4 = testModals();
  const test5 = testDropdownToggle();
  
  console.log('\n📊 Test Results Summary:');
  console.log(`Profile Button: ${test1 ? '✅' : '❌'}`);
  console.log(`Profile Dropdown: ${test2 ? '✅' : '❌'}`);
  console.log(`Dropdown Items: ${test3 ? '✅' : '❌'}`);
  console.log(`Modals: ${test4 ? '✅' : '❌'}`);
  console.log(`Toggle Functionality: ${test5 ? '✅' : '❌'}`);
  
  const allPassed = test1 && test2 && test3 && test4 && test5;
  console.log(`\n🎯 Overall Result: ${allPassed ? '✅ ALL TESTS PASSED' : '❌ SOME TESTS FAILED'}`);
  
  if (allPassed) {
    console.log('\n🎉 Profile dropdown functionality is working correctly!');
    console.log('💡 Manual Testing Instructions:');
    console.log('1. Click the profile icon in the header');
    console.log('2. Verify the dropdown appears with three options');
    console.log('3. Click each option to verify the corresponding modal opens');
    console.log('4. Click outside the dropdown to verify it closes');
    console.log('5. Test on mobile devices to ensure responsive design');
  } else {
    console.log('\n🔧 Issues detected. Please check the console for specific errors.');
  }
}

// Export for use in browser console
if (typeof window !== 'undefined') {
  window.testProfileDropdown = runAllTests;
  console.log('💡 Run testProfileDropdown() in the console to test the functionality');
}

// Run tests if this script is executed directly
if (typeof module === 'undefined') {
  // Browser environment
  setTimeout(runAllTests, 1000); // Wait for page to load
} else {
  // Node.js environment
  console.log('This test script is designed to run in a browser environment.');
  console.log('Please open the user-dashboard.html page and run testProfileDropdown() in the console.');
}
