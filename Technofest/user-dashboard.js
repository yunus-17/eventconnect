// Student Dashboard JavaScript

// DOM Elements
const studentName = document.getElementById('profileName');
const rollNumber = document.getElementById('rollNumber');
const studentFullName = document.getElementById('studentFullName');
const department = document.getElementById('department');
const year = document.getElementById('year');
const cgpa = document.getElementById('cgpa');
const createdAt = document.getElementById('createdAt');
const lastLogin = document.getElementById('lastLogin');
const loginTime = document.getElementById('loginTime');
const logoutBtn = document.getElementById('logoutBtn');
const passwordModal = document.getElementById('passwordModal');
const passwordChangeForm = document.getElementById('passwordChangeForm');
const loadingOverlay = document.getElementById('loadingOverlay');

// Profile dropdown elements
const profileBtn = document.getElementById('profileBtn');
const profileDropdown = document.getElementById('profileDropdown');

// Dropdown openers
const openQuickActionsBtn = document.getElementById('openQuickActions');
const openRecentActivityBtn = document.getElementById('openRecentActivity');
const openAcademicStatusBtn = document.getElementById('openAcademicStatus');

// Modals for dropdown items
const quickActionsModal = document.getElementById('quickActionsModal');
const recentActivityModal = document.getElementById('recentActivityModal');
const academicStatusModal = document.getElementById('academicStatusModal');

// Upcoming events
const upcomingEventsContainer = document.getElementById('upcomingEventsContainer');
const refreshUpcomingBtn = document.getElementById('refreshUpcomingBtn');
const loadMoreEventsBtn = document.getElementById('loadMoreEventsBtn');

// API Base URL
const API_BASE_URL = window.location.origin;

// Pagination variables for events
let currentEventPage = 1;
let hasMoreEvents = false;
let allFetchedEvents = [];

// Check authentication on page load
document.addEventListener('DOMContentLoaded', () => {
  console.log('Dashboard loaded, checking authentication...');
  
  // Track last update time to avoid unnecessary refreshes
  let lastEventUpdateTime = Date.now();
  
  // Add visibility change listener to refresh events when page becomes visible
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
      console.log('Page became visible, refreshing events...');
      // Only refresh if it's been more than 10 seconds since last update
      if (Date.now() - lastEventUpdateTime > 10000) {
        fetchUpcomingEvents(true); // Reset pagination to ensure fresh data
        loadEventsParticipated();
        lastEventUpdateTime = Date.now();
      } else {
        console.log('Skipping refresh - last update was recent');
      }
    }
  });
  
  // Add periodic refresh every 30 seconds to keep events up to date
  setInterval(() => {
    console.log('Periodic refresh of events...');
    fetchUpcomingEvents(true); // Reset pagination to ensure fresh data
    loadEventsParticipated();
    lastEventUpdateTime = Date.now();
  }, 30000);
  
  // Add more frequent refresh when page is visible (every 15 seconds)
  setInterval(() => {
    if (!document.hidden) {
      console.log('Frequent refresh while page is visible...');
      fetchUpcomingEvents(true); // Reset pagination to ensure fresh data
      lastEventUpdateTime = Date.now();
    }
  }, 15000);
  
  // Add enhanced CSS for beautiful event cards
  const style = document.createElement('style');
  style.textContent = `
    /* Enhanced Event Card Styles */
    .event-card {
      background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
      border-radius: 16px;
      padding: 1.5rem;
      margin-bottom: 1.5rem;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
      border: 1px solid rgba(255, 255, 255, 0.2);
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      position: relative;
      overflow: hidden;
    }
    
    .event-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 4px;
      background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
      border-radius: 16px 16px 0 0;
    }
    
    .event-card:hover {
      transform: translateY(-8px);
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.12);
      border-color: rgba(102, 126, 234, 0.3);
    }
    
    .event-card.main-event {
      border: 2px solid #4CAF50;
      background: linear-gradient(135deg, #f8fff9 0%, #e8f5e8 100%);
      box-shadow: 0 12px 40px rgba(76, 175, 80, 0.15);
    }
    
    .event-card.main-event::before {
      background: linear-gradient(90deg, #4CAF50 0%, #45a049 100%);
    }
    
    .event-card.new-event {
      border: 2px solid #ff6b35;
      background: linear-gradient(135deg, #fff8f6 0%, #ffe8e0 100%);
      animation: pulse 2s infinite;
    }
    
    .event-card.new-event::before {
      background: linear-gradient(90deg, #ff6b35 0%, #ff5722 100%);
    }
    
    @keyframes pulse {
      0% { box-shadow: 0 8px 32px rgba(255, 107, 53, 0.15); }
      50% { box-shadow: 0 8px 32px rgba(255, 107, 53, 0.25); }
      100% { box-shadow: 0 8px 32px rgba(255, 107, 53, 0.15); }
    }
    
    /* Event Header */
    .event-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 1rem;
      flex-wrap: wrap;
      gap: 0.5rem;
    }
    
    .event-header h3 {
      color: #2c3e50;
      font-size: 1.4rem;
      font-weight: 700;
      margin: 0;
      line-height: 1.3;
      flex: 1;
      min-width: 200px;
    }
    
    .event-category {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 0.5rem 1rem;
      border-radius: 20px;
      font-size: 0.8rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
    }
    
    .main-event-badge {
      background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%);
      color: white;
      padding: 0.5rem 1rem;
      border-radius: 20px;
      font-size: 0.8rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      box-shadow: 0 4px 12px rgba(76, 175, 80, 0.3);
      animation: glow 2s ease-in-out infinite alternate;
    }
    
    @keyframes glow {
      from { box-shadow: 0 4px 12px rgba(76, 175, 80, 0.3); }
      to { box-shadow: 0 4px 20px rgba(76, 175, 80, 0.5); }
    }
    
    .new-event-badge {
      background: linear-gradient(135deg, #ff6b35 0%, #ff5722 100%);
      color: white;
      padding: 0.5rem 1rem;
      border-radius: 20px;
      font-size: 0.8rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      box-shadow: 0 4px 12px rgba(255, 107, 53, 0.3);
      animation: bounce 1s infinite;
    }
    
    @keyframes bounce {
      0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
      40% { transform: translateY(-3px); }
      60% { transform: translateY(-2px); }
    }
    
    /* Event Details */
    .event-details {
      margin-bottom: 1.5rem;
    }
    
    .event-details p {
      margin: 0.5rem 0;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: #5a6c7d;
      font-size: 0.95rem;
    }
    
    .event-date {
      color: #e74c3c !important;
      font-weight: 600;
      font-size: 1rem !important;
    }
    
    .event-venue {
      color: #3498db !important;
      font-weight: 500;
    }
    
    .event-description {
      color: #34495e !important;
      line-height: 1.6;
      font-size: 1rem !important;
      margin-top: 1rem;
      padding: 1rem;
      background: rgba(102, 126, 234, 0.05);
      border-radius: 8px;
      border-left: 4px solid #667eea;
    }
    
    .event-type {
      background: linear-gradient(135deg, #f39c12 0%, #e67e22 100%);
      color: white;
      padding: 0.4rem 0.8rem;
      border-radius: 15px;
      font-size: 0.8rem;
      font-weight: 600;
      display: inline-block;
      margin-top: 0.5rem;
      box-shadow: 0 2px 8px rgba(243, 156, 18, 0.3);
    }
    
    /* Sub Events */
    .sub-events {
      margin-top: 1.5rem;
      padding: 1.5rem;
      background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
      border-radius: 12px;
      border-left: 4px solid #4CAF50;
      box-shadow: inset 0 2px 8px rgba(0, 0, 0, 0.05);
    }
    
    .sub-events h4 {
      margin: 0 0 1rem 0;
      color: #2c3e50;
      font-size: 1.2rem;
      font-weight: 700;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    
    .sub-events h4::before {
      content: '📋';
      font-size: 1.1rem;
    }
    
    .sub-events-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
    
    .sub-event-item {
      background: white;
      padding: 1rem;
      border-radius: 10px;
      border: 1px solid #dee2e6;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
      transition: all 0.2s ease;
    }
    
    .sub-event-item:hover {
      transform: translateX(5px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      border-color: #4CAF50;
    }
    
    .sub-event-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.8rem;
    }
    
    .sub-event-header strong {
      color: #2c3e50;
      font-weight: 600;
    }
    
    .sub-event-category {
      background: linear-gradient(135deg, #6c757d 0%, #5a6268 100%);
      color: white;
      padding: 0.3rem 0.6rem;
      border-radius: 12px;
      font-size: 0.7rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.3px;
    }
    
    .sub-event-details {
      display: flex;
      gap: 1rem;
      margin-bottom: 0.8rem;
      font-size: 0.85rem;
      color: #6c757d;
      flex-wrap: wrap;
    }
    
    .sub-event-details span {
      display: flex;
      align-items: center;
      gap: 0.3rem;
      padding: 0.2rem 0.5rem;
      background: rgba(108, 117, 125, 0.1);
      border-radius: 6px;
    }
    
    .sub-event-description {
      font-size: 0.9rem;
      color: #495057;
      line-height: 1.5;
    }
    
    /* Event Actions */
    .event-actions {
      display: flex;
      gap: 0.8rem;
      flex-wrap: wrap;
      margin-top: 1.5rem;
    }
    
    .event-actions button {
      padding: 0.8rem 1.5rem;
      border-radius: 25px;
      border: none;
      cursor: pointer;
      font-size: 0.9rem;
      font-weight: 600;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      text-transform: uppercase;
      letter-spacing: 0.5px;
      position: relative;
      overflow: hidden;
    }
    
    .event-actions button::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
      transition: left 0.5s;
    }
    
    .event-actions button:hover::before {
      left: 100%;
    }
    
    .event-actions button:first-child {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
    }
    
    .event-actions button:first-child:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(102, 126, 234, 0.6);
    }
    
    .register-now-btn {
      background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%) !important;
      color: white !important;
      box-shadow: 0 4px 15px rgba(76, 175, 80, 0.4) !important;
    }
    
    .register-now-btn:hover {
      transform: translateY(-2px) !important;
      box-shadow: 0 8px 25px rgba(76, 175, 80, 0.6) !important;
      background: linear-gradient(135deg, #45a049 0%, #4CAF50 100%) !important;
    }
    
    /* Responsive Design */
    @media (max-width: 768px) {
      .event-card {
        padding: 1rem;
        margin-bottom: 1rem;
      }
      
      .event-header {
        flex-direction: column;
        align-items: flex-start;
      }
      
      .event-header h3 {
        font-size: 1.2rem;
        min-width: auto;
      }
      
      .event-actions {
        flex-direction: column;
      }
      
      .event-actions button {
        width: 100%;
      }
    }
    
    /* Loading Skeleton */
    .event-card.skeleton {
      background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
      background-size: 200% 100%;
      animation: loading 1.5s infinite;
    }
    
    @keyframes loading {
      0% { background-position: 200% 0; }
      100% { background-position: -200% 0; }
    }
    
    .skeleton-line {
      background: #e0e0e0;
      border-radius: 4px;
      margin-bottom: 0.5rem;
    }
  `;
  document.head.appendChild(style);
  
  // Clear any old cached data to ensure fresh data
  const currentUser = localStorage.getItem('user');
  if (currentUser) {
    console.log('Found existing user data, will refresh from server');
    // Update welcome message immediately if user data exists
    try {
      const userData = JSON.parse(currentUser);
      if (userData.name || userData.rollNumber) {
        const studentNameElement = document.getElementById('profileName');
        if (studentNameElement) {
          const displayName = userData.name || 'Student ' + userData.rollNumber;
          studentNameElement.textContent = displayName;
          console.log('Updated welcome message with existing data:', displayName);
        }
      }
    } catch (error) {
      console.error('Error parsing existing user data:', error);
    }
  }
  
  checkAuth();
  loadStudentProfile(); // This will always fetch fresh data from server
  updateLoginTime();
  setupProfileDropdown();
  fetchUpcomingEvents();
  // Update academic status on page load
  updateAcademicStatus();
  // Load events participated count
  loadEventsParticipated();
  // Check for new notifications
  checkForNewNotifications();
});

// Authentication check
function checkAuth() {
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user');
  
  console.log('Checking authentication - Token:', token ? 'Exists' : 'Missing', 'User:', user ? 'Exists' : 'Missing');
  
  if (!token) {
    console.log('No token found, redirecting to login');
    redirectToLogin();
    return;
  }
  
  if (!user) {
    console.log('No user data found, will load from API');
    return; // Allow loading from API
  }
  
  try {
    const userData = JSON.parse(user);
    console.log('Parsed user data:', userData);
    
    if (userData.role !== 'student') {
      console.log('User is not a student, redirecting to login');
      redirectToLogin();
      return;
    }
    
    // If we have valid user data, display it immediately
    console.log('Displaying existing user data');
    displayStudentInfo(userData);
    
  } catch (error) {
    console.error('Error parsing user data:', error);
    // Don't redirect immediately, try to load from API
    console.log('Will try to load fresh data from API');
  }
}

// Load student profile
async function loadStudentProfile() {
  try {
    showLoading();
    
    const token = localStorage.getItem('token');
    console.log('Loading profile with token:', token ? 'Token exists' : 'No token');
    
    if (!token) {
      throw new Error('No authentication token found');
    }
    
    // Always fetch fresh data from the server
    const response = await fetch(`${API_BASE_URL}/api/auth/profile`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      cache: 'no-cache' // Ensure we don't get cached data
    });
    
    console.log('Profile API response status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error response:', errorText);
      
      if (response.status === 401) {
        // Token is invalid, redirect to login
        console.log('Token is invalid, redirecting to login');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        redirectToLogin();
        return;
      }
      
      throw new Error(`Failed to load profile: ${response.status} ${response.statusText}`);
    }
    
    const result = await response.json();
    console.log('Profile API result:', result);
    
    if (result.success && result.user) {
      // Store fresh user data in localStorage
      localStorage.setItem('user', JSON.stringify(result.user));
      console.log('Stored fresh user data in localStorage:', result.user);
      displayStudentInfo(result.user);
    } else {
      throw new Error(result.message || 'Failed to load profile - no user data');
    }
    
  } catch (error) {
    console.error('Error loading profile:', error);
    showError(`Failed to load profile: ${error.message}`);
  } finally {
    hideLoading();
  }
}

// Display student information
function displayStudentInfo(user) {
  console.log('Displaying student info:', user);
  console.log('Name field:', user.name);
  console.log('Attendance field:', user.attendance);
  
  // Set the student name in the header welcome message
  if (studentName) {
    const displayName = user.name || 'Student ' + user.rollNumber;
    studentName.textContent = displayName;
    console.log('Updated welcome message with name:', displayName);
  }
  
  // Set all the student information fields
  if (rollNumber) rollNumber.textContent = user.rollNumber || '-';
  if (studentFullName) studentFullName.textContent = user.name || 'Student ' + user.rollNumber;
  if (department) department.textContent = user.department || '-';
  if (year) year.textContent = user.year || '-';
  
  // Get CGPA from localStorage (stored during login)
  const storedCgpa = localStorage.getItem('studentCgpa');
  const cgpaValue = storedCgpa !== null && storedCgpa !== 'null' ? parseFloat(storedCgpa) : null;
  
  if (cgpa) cgpa.textContent = cgpaValue ? cgpaValue.toFixed(2) : 'Not Available';
  
  // Update academic status modal CGPA
  const academicCgpaElement = document.getElementById('academicCgpa');
  console.log('Academic CGPA element found:', academicCgpaElement);
  console.log('User CGPA value:', cgpaValue);
  if (academicCgpaElement) {
    const displayCgpa = cgpaValue ? cgpaValue.toFixed(2) : 'Not Available';
    academicCgpaElement.textContent = displayCgpa;
    console.log('Updated academic CGPA to:', displayCgpa);
  } else {
    console.log('Academic CGPA element not found!');
  }
  
  // Update academic status modal attendance
  const attendanceElement = document.getElementById('attendancePercentage');
  if (attendanceElement && user.attendance) {
    const attendanceValue = user.attendance.toFixed(1);
    attendanceElement.textContent = `${attendanceValue}%`;
    console.log('Updated attendance to:', attendanceValue);
  }
  
  // Format dates
  if (user.createdAt) {
    createdAt.textContent = new Date(user.createdAt).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
  
  if (user.lastLogin) {
    lastLogin.textContent = new Date(user.lastLogin).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
  
  // Immediately update academic status modal
  console.log('Calling updateAcademicStatus after displaying student info...');
  updateAcademicStatus();
}

// Profile dropdown handlers
function setupProfileDropdown() {
  if (!profileBtn || !profileDropdown) return;

  profileBtn.addEventListener('click', () => {
    const expanded = profileBtn.getAttribute('aria-expanded') === 'true';
    profileBtn.setAttribute('aria-expanded', String(!expanded));
    profileDropdown.setAttribute('aria-hidden', String(expanded));
    profileDropdown.classList.toggle('open');
  });

  document.addEventListener('click', (e) => {
    if (!profileDropdown.contains(e.target) && !profileBtn.contains(e.target)) {
      profileBtn.setAttribute('aria-expanded', 'false');
      profileDropdown.setAttribute('aria-hidden', 'true');
      profileDropdown.classList.remove('open');
    }
  });

  if (openQuickActionsBtn) openQuickActionsBtn.addEventListener('click', () => {
    profileDropdown.classList.remove('open');
    quickActionsModal.style.display = 'block';
  });
  if (openRecentActivityBtn) openRecentActivityBtn.addEventListener('click', () => {
    profileDropdown.classList.remove('open');
    recentActivityModal.style.display = 'block';
  });
  if (openAcademicStatusBtn) openAcademicStatusBtn.addEventListener('click', () => {
    profileDropdown.classList.remove('open');
    academicStatusModal.style.display = 'block';
    // Update academic status when modal is opened
    console.log('Academic Status modal opened, updating CGPA...');
    updateAcademicStatus();
  });
}

// Update academic status when modal is opened
function updateAcademicStatus() {
  // Get user data from localStorage
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  console.log('updateAcademicStatus called with user data:', user);
  
  // Update CGPA in academic status modal
  const academicCgpaElement = document.getElementById('academicCgpa');
  console.log('Looking for academicCgpa element...');
  
  if (academicCgpaElement) {
    console.log('Found academicCgpa element:', academicCgpaElement);
    
    // Get CGPA from localStorage (stored during login)
    const storedCgpa = localStorage.getItem('studentCgpa');
    const cgpaValue = storedCgpa !== null && storedCgpa !== 'null' ? parseFloat(storedCgpa) : null;
    
    if (cgpaValue) {
      const displayCgpa = cgpaValue.toFixed(2);
      academicCgpaElement.textContent = displayCgpa;
      console.log('Successfully updated academic CGPA to:', displayCgpa);
    } else {
      console.log('No CGPA value available');
      academicCgpaElement.textContent = 'Not Available';
    }
  } else {
    console.log('ERROR: academicCgpa element not found!');
    // Try to find it by different methods
    const allElements = document.querySelectorAll('[id*="cgpa"]');
    console.log('All elements with "cgpa" in ID:', allElements);
  }
}

// Update login time
function updateLoginTime() {
  const now = new Date();
  loginTime.textContent = now.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  });
}

// Logout functionality
logoutBtn.addEventListener('click', () => {
  // Show confirmation alert
  if (confirm('Are you sure you want to logout?')) {
    logout();
  }
});

async function logout() {
  try {
    const token = localStorage.getItem('token');
    
    // Call logout API
    await fetch(`${API_BASE_URL}/api/auth/logout`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
  } catch (error) {
    console.error('Logout error:', error);
  } finally {
    // Clear local storage and redirect
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('studentCgpa'); // Clear CGPA data on logout
    localStorage.removeItem('seenEvents'); // Clear seen events on logout
    redirectToLogin();
  }
}

// Password change functionality
function showPasswordChangeModal() {
  // Close quick actions modal first
  closeQuickActionsModal();
  // Open password modal
  passwordModal.style.display = 'block';
  // Clear form
  passwordChangeForm.reset();
}

function closePasswordModal() {
  passwordModal.style.display = 'none';
}

// Close modal when clicking outside
window.addEventListener('click', (event) => {
  if (event.target === passwordModal) {
    closePasswordModal();
  }
  if (event.target === quickActionsModal) {
    closeQuickActionsModal();
  }
  if (event.target === recentActivityModal) {
    closeRecentActivityModal();
  }
  if (event.target === academicStatusModal) {
    closeAcademicStatusModal();
  }
  if (event.target === document.getElementById('profileModal')) {
    closeProfileModal();
  }
});

// Password change form submission
passwordChangeForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const formData = new FormData(passwordChangeForm);
  const currentPassword = formData.get('currentPassword');
  const newPassword = formData.get('newPassword');
  const confirmPassword = formData.get('confirmPassword');
  
  // Validation
  if (newPassword !== confirmPassword) {
    showError('New passwords do not match');
    return;
  }
  
  if (newPassword.length < 6) {
    showError('New password must be at least 6 characters long');
    return;
  }
  
  try {
    showLoading();
    
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/api/auth/change-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        currentPassword,
        newPassword
      })
    });
    
    const result = await response.json();
    
    if (result.success) {
      showSuccess('Password changed successfully');
      closePasswordModal();
      passwordChangeForm.reset();
    } else {
      showError(result.message || 'Failed to change password');
    }
    
  } catch (error) {
    console.error('Password change error:', error);
    showError('Network error. Please try again.');
  } finally {
    hideLoading();
  }
});

// Quick action functions
function viewProfile() {
  // Get user data from localStorage
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  console.log('viewProfile - User data from localStorage:', user);
  
  if (!user.rollNumber) {
    showError('User data not found. Please refresh the page.');
    return;
  }
  
  // Generate a random attendance percentage between 65% and 95%
  const randomAttendance = (Math.random() * 30 + 65).toFixed(1);
  
  // Populate profile modal with user data
  document.getElementById('profileRollNumber').textContent = user.rollNumber || '-';
  document.getElementById('profileModalName').textContent = user.name || 'Student ' + user.rollNumber;
  document.getElementById('profileDepartment').textContent = user.department || '-';
  document.getElementById('profileYear').textContent = user.year || '-';
  // Get CGPA from localStorage (stored during login)
  const storedCgpa = localStorage.getItem('studentCgpa');
  const cgpaValue = storedCgpa !== null && storedCgpa !== 'null' ? parseFloat(storedCgpa) : null;
  document.getElementById('profileCgpa').textContent = cgpaValue ? cgpaValue.toFixed(2) : 'Not Available';
  document.getElementById('profileAttendance').textContent = `${randomAttendance}%`;
  
  console.log('Profile modal populated with:');
  console.log('- Roll Number:', user.rollNumber);
  console.log('- Name:', user.name || 'Student ' + user.rollNumber);
  console.log('- Department:', user.department);
  console.log('- Year:', user.year);
  console.log('- CGPA:', cgpaValue);
  console.log('- Attendance:', randomAttendance + '%');
  
  // Close quick actions modal and open profile modal
  closeQuickActionsModal();
  document.getElementById('profileModal').style.display = 'block';
}

function viewNotifications() {
  // Close quick actions modal and open notifications modal
  closeQuickActionsModal();
  document.getElementById('notificationsModal').style.display = 'block';
  
  // Load upcoming events in the notifications modal
  loadNotificationsEvents();
}

function viewSchedule() {
  // This could show class schedule or navigate to a schedule page
  alert('Class schedule functionality will be implemented here');
}

// Close modal helpers for new modals
function closeQuickActionsModal() { quickActionsModal.style.display = 'none'; }
function closeRecentActivityModal() { recentActivityModal.style.display = 'none'; }
function closeAcademicStatusModal() { academicStatusModal.style.display = 'none'; }
function closeProfileModal() { document.getElementById('profileModal').style.display = 'none'; }

// Notifications Modal Functions
function closeNotificationsModal() {
  document.getElementById('notificationsModal').style.display = 'none';
}

function loadNotificationsEvents() {
  const container = document.getElementById('notificationsEventsContainer');
  if (!container) return;
  
  // Show loading skeleton
  container.innerHTML = createNotificationsSkeleton(6);
  
  // Fetch events from admin API
  fetchNotificationsEvents();
}

function createNotificationsSkeleton(count) {
  return Array.from({ length: count }).map(() => `
    <div class="notification-event-card skeleton">
      <div class="skeleton-line" style="width:70%;height:18px;margin-bottom:8px;"></div>
      <div class="skeleton-line" style="width:50%;height:14px;margin-bottom:6px;"></div>
      <div class="skeleton-line" style="width:40%;height:12px;"></div>
    </div>
  `).join('');
}

async function fetchNotificationsEvents() {
  try {
    const container = document.getElementById('notificationsEventsContainer');
    const response = await fetch(`${API_BASE_URL}/api/events?status=upcoming&limit=12`);
    const data = await response.json();
    
    if (!data.success) {
      throw new Error('Failed to load events');
    }
    
    renderNotificationsEvents(data.events || []);
  } catch (error) {
    console.error('Error fetching notifications events:', error);
    const container = document.getElementById('notificationsEventsContainer');
    container.innerHTML = `
      <div class="error-message">
        <p>Failed to load upcoming events. Please try again later.</p>
        <button onclick="loadNotificationsEvents()" class="btn-secondary">Retry</button>
      </div>
    `;
  }
}

function renderNotificationsEvents(events) {
  const container = document.getElementById('notificationsEventsContainer');
  
  if (events.length === 0) {
    container.innerHTML = `
      <div class="no-events-message">
        <p>No upcoming events at the moment.</p>
        <p>Check back soon for new events and activities!</p>
      </div>
    `;
    return;
  }
  
  container.innerHTML = events.map(event => {
    const startDate = new Date(event.startDate);
    const endDate = new Date(event.endDate);
    const formattedStart = startDate.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
    const formattedEnd = endDate.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
    
    const isMultiDay = startDate.toDateString() !== endDate.toDateString();
    const dateDisplay = isMultiDay ? `${formattedStart} - ${formattedEnd}` : formattedStart;
    
    const isWorkshop = event.category === 'workshop';
    const isHackathon = event.category === 'hackathon';
    const hasEventLink = event.eventLink && event.eventLink.trim() !== '';
    const hasFormLink = event.formLink && event.formLink.trim() !== '';
    
    return `
      <div class="notification-event-card">
        <div class="event-header">
          <h4>${event.title}</h4>
          <span class="event-category">${event.category.replace('-', ' ')}</span>
        </div>
        <div class="event-details">
          <p class="event-date">📅 ${dateDisplay}</p>
          <p class="event-venue">📍 ${event.venue || 'Venue TBA'}</p>
          <p class="event-description">${event.description ? event.description.substring(0, 100) + '...' : 'No description available'}</p>
        </div>
        <div class="event-actions">
          <button class="btn-primary" onclick="viewEventDetails('${event._id}')">View Details</button>
          ${isWorkshop && hasFormLink ? `
            <button class="btn-success" onclick="window.open('${event.formLink}', '_blank')">Register Now</button>
          ` : isWorkshop && hasEventLink ? `
            <button class="btn-success" onclick="window.open('${event.eventLink}', '_blank')">Register Now</button>
          ` : isHackathon && hasFormLink ? `
            <button class="btn-success" onclick="window.open('${event.formLink}', '_blank')">Register Now</button>
          ` : `
            <button class="btn-secondary" onclick="registerForEvent('${event._id}')">Register</button>
          `}
        </div>
      </div>
    `;
  }).join('');
}

function refreshNotifications() {
  loadNotificationsEvents();
}

function viewEventDetails(eventId) {
  // Navigate to event details page or open event modal
  window.location.href = `/events/${eventId}`;
}

function registerForEvent(eventId) {
  // Handle event registration
  alert(`Registration for event ${eventId} will be implemented here`);
}

function viewEventDetails(eventId) {
  // Navigate to event details page or open event modal
  window.location.href = `/events/${eventId}`;
}

// Load events participated count
async function loadEventsParticipated() {
  try {
    const token = localStorage.getItem('token');
    const registeredEventsContainer = document.getElementById('registeredEventsContainer');
    
    // Show loading state if container exists
    if (registeredEventsContainer) {
      registeredEventsContainer.innerHTML = '<div class="loading-message">Loading your registered events...</div>';
    }
    
    const response = await fetch(`${API_BASE_URL}/api/registrations/my-events`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (response.ok) {
      const data = await response.json();
      if (data.success) {
        const eventsCount = data.registrations ? data.registrations.length : 0;
        updateEventsParticipatedCount(eventsCount);
        
        // Update UI with registered events if container exists
        if (registeredEventsContainer && eventsCount > 0) {
          registeredEventsContainer.innerHTML = ''; // Clear loading message
          // Display registered events
          data.registrations.forEach(reg => {
            const eventCard = document.createElement('div');
            eventCard.className = 'registered-event-card';
            eventCard.innerHTML = `
              <h4>${reg.event ? reg.event.title : 'Unknown Event'}</h4>
              <p>${reg.event ? reg.event.description.substring(0, 100) + '...' : 'No description available'}</p>
              <div class="event-date">Registered on: ${new Date(reg.createdAt).toLocaleDateString()}</div>
            `;
            registeredEventsContainer.appendChild(eventCard);
          });
        } else if (registeredEventsContainer) {
          registeredEventsContainer.innerHTML = '<div class="empty-message">No registered events found</div>';
        }
      } else {
        updateEventsParticipatedCount(0);
        if (registeredEventsContainer) {
          registeredEventsContainer.innerHTML = '<div class="error-message">No registered events found</div>';
        }
      }
    } else {
      updateEventsParticipatedCount(0);
      // Show user-friendly error message
      if (registeredEventsContainer) {
        if (response.status === 500) {
          registeredEventsContainer.innerHTML = '<div class="error-message">Unable to load your registered events. Please try again later.</div>';
        } else {
          registeredEventsContainer.innerHTML = `<div class="error-message">Error loading registered events (${response.status})</div>`;
        }
      }
      console.error('Error response from API:', response.status, response.statusText);
    }
  } catch (error) {
    console.error('Error loading events participated:', error);
    updateEventsParticipatedCount(0);
    
    // Show user-friendly error message
    const registeredEventsContainer = document.getElementById('registeredEventsContainer');
    if (registeredEventsContainer) {
      registeredEventsContainer.innerHTML = '<div class="error-message">Unable to connect to the server. Please check your internet connection and try again.</div>';
    }
  }
}

function updateEventsParticipatedCount(count) {
  const eventsParticipatedElement = document.getElementById('eventsParticipated');
  if (eventsParticipatedElement) {
    eventsParticipatedElement.textContent = count;
    
    // Update the timestamp to show it's been updated
    const timestampElement = eventsParticipatedElement.closest('.activity-item').querySelector('small');
    if (timestampElement) {
      timestampElement.textContent = 'Updated just now';
    }
  }
}





// Upcoming events fetcher
async function fetchUpcomingEvents(resetPagination = true) {
  try {
    console.log('🔄 Fetching upcoming events...');
    
    if (!upcomingEventsContainer) {
      console.log('❌ upcomingEventsContainer not found!');
      return;
    }
    
    // Always clear the events array when fetching new events to prevent duplicates
    if (resetPagination) {
      currentEventPage = 1;
      allFetchedEvents = [];
      upcomingEventsContainer.innerHTML = createSkeletonCards(4);
    } else {
      // For periodic refreshes, we still want to clear the array to avoid duplicates
      allFetchedEvents = [];
    }
    
    // Fetch events from all categories with pagination
    const limit = 50;
    const offset = (currentEventPage - 1) * limit;
    console.log(`📡 Making API call to /api/events?status=upcoming&limit=${limit}&page=${currentEventPage}`);
    const res = await fetch(`${API_BASE_URL}/api/events?status=upcoming&limit=${limit}&page=${currentEventPage}`);
    console.log('📡 API Response status:', res.status);
    
    if (!res.ok) {
      throw new Error(`API call failed: ${res.status} ${res.statusText}`);
    }
    
    const data = await res.json();
    console.log('📡 API Response data:', data);
    
    if (!data.success) {
      throw new Error('Failed to load events: ' + (data.message || 'Unknown error'));
    }
    
    console.log(`📊 Found ${data.events ? data.events.length : 0} events in response`);
    
    // Get all events (both main events and regular events)
    let newEvents = data.events || [];
    
    // Filter out invalid events by validating required fields
    newEvents = newEvents.filter(event => {
      // Check for minimum required fields that legitimate events should have
      const hasRequiredFields = event && 
                               event._id && 
                               event.title && 
                               event.startDate;
      
      // Check for valid dates - events should have a start date after 2023
      const hasValidDates = event.startDate && new Date(event.startDate) > new Date('2023-01-01');
      
      // Log truly invalid events for debugging (missing title or startDate)
      if (!hasRequiredFields || !hasValidDates) {
        console.warn('⚠️ Filtered out invalid event (missing required fields):', event);
      }
      
      // An event must have required fields and valid dates
      return hasRequiredFields && hasValidDates;
    });
    
    console.log(`📊 After validation: ${newEvents.length} legitimate events`);
    
    // Replace events collection instead of appending to prevent duplicates
    allFetchedEvents = newEvents;
    
    console.log(`📊 Total events collected: ${allFetchedEvents.length}`);
    
    // Check if there are more events to load
    hasMoreEvents = newEvents.length === limit;
    
    // Separate main events and sub-events
    const mainEvents = allFetchedEvents.filter(event => event.isMainEvent);
    const regularEvents = allFetchedEvents.filter(event => !event.isMainEvent && !event.mainEventId);
    const subEvents = allFetchedEvents.filter(event => !event.isMainEvent && event.mainEventId);
    
    console.log(`🏆 Main events: ${mainEvents.length}`);
    console.log(`📋 Regular events: ${regularEvents.length}`);
    console.log(`🔗 Sub events: ${subEvents.length}`);
    
    // Group sub-events under their main events
    const hierarchicalEvents = mainEvents.map(mainEvent => {
      const relatedSubEvents = subEvents.filter(subEvent => 
        subEvent.mainEventId === mainEvent._id
      );
      return {
        ...mainEvent,
        subEvents: relatedSubEvents
      };
    });
    
    // Combine regular events with hierarchical events
    const allUpcomingEvents = [...regularEvents, ...hierarchicalEvents];
    
    // Filter and sort events by start date
    const upcomingEvents = allUpcomingEvents
      .filter(event => new Date(event.startDate) > new Date())
      .sort((a, b) => new Date(a.startDate) - new Date(b.startDate));
    
    console.log(`🎯 Filtered upcoming events: ${upcomingEvents.length}`);
    
    // Check for new events and show notifications (only on first load)
    if (resetPagination) {
      await checkForNewEvents(upcomingEvents);
    }
    
    renderUpcomingEvents(upcomingEvents);
    
    // Show/hide load more button
    if (loadMoreEventsBtn) {
      loadMoreEventsBtn.style.display = hasMoreEvents ? 'inline-block' : 'none';
    }
    
  } catch (err) {
    console.error('❌ Upcoming events error:', err);
    upcomingEventsContainer.innerHTML = `<div style="padding:1rem;color:#c62828;background:#ffebee;border:1px solid #ffcdd2;border-radius:8px;">
      Failed to load upcoming events: ${err.message}
    </div>`;
  }
}

// Function to check for new notifications from server
async function checkForNewNotifications() {
  try {
    const token = localStorage.getItem('token');
    if (!token) return;
    
    const response = await fetch(`${API_BASE_URL}/api/events/notifications/recent`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (response.ok) {
      const data = await response.json();
      if (data.success && data.notifications && data.notifications.length > 0) {
        // Get previously seen notifications
        const seenNotifications = JSON.parse(localStorage.getItem('seenNotifications') || '[]');
        
        // Show notifications for unseen events
        data.notifications.forEach(notification => {
          if (!seenNotifications.includes(notification.eventId)) {
            showNotification(`🎉 ${notification.title}`, 'success');
          }
        });
        
        // Update seen notifications
        const newNotificationIds = data.notifications.map(n => n.eventId);
        const updatedSeenNotifications = [...new Set([...seenNotifications, ...newNotificationIds])];
        localStorage.setItem('seenNotifications', JSON.stringify(updatedSeenNotifications));
      }
    }
  } catch (error) {
    console.error('Error checking for new notifications:', error);
  }
}

// Function to check for new events and show notifications
async function checkForNewEvents(currentEvents) {
  try {
    // Get previously seen events from localStorage
    const seenEvents = JSON.parse(localStorage.getItem('seenEvents') || '[]');
    const currentEventIds = currentEvents.map(event => event._id);
    
    // Find new events (events that weren't seen before)
    const newEvents = currentEvents.filter(event => !seenEvents.includes(event._id));
    
    // Also fetch recent notifications from server
    const token = localStorage.getItem('token');
    if (token) {
      const response = await fetch(`${API_BASE_URL}/api/events/notifications/recent`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.notifications) {
          // Show notifications for recent events
          data.notifications.forEach(notification => {
            if (!seenEvents.includes(notification.eventId)) {
              showNotification(`🎉 ${notification.title}`, 'success');
              // Mark this event as new for highlighting in the UI
              const relatedEvent = currentEvents.find(event => event._id === notification.eventId);
              if (relatedEvent) {
                relatedEvent.isNew = true;
              }
            }
          });
        }
      }
    }
    
    // Show notification for new events
    if (newEvents.length > 0) {
      const eventNames = newEvents.map(event => event.title).join(', ');
      showNotification(`🎉 New events available: ${eventNames}`, 'success');
      
      // Mark these events as "new" for highlighting in the UI
      newEvents.forEach(event => {
        event.isNew = true;
      });
      
      // Update seen events list
      const updatedSeenEvents = [...new Set([...seenEvents, ...currentEventIds])];
      localStorage.setItem('seenEvents', JSON.stringify(updatedSeenEvents));
    }
  } catch (error) {
    console.error('Error checking for new events:', error);
  }
}

function createSkeletonCards(count) {
  return Array.from({ length: count }).map(() => `
    <div class="event-card skeleton">
      <div class="skeleton-line" style="width:60%;height:20px;margin-bottom:8px;"></div>
      <div class="skeleton-line" style="width:40%;height:14px;"></div>
    </div>
  `).join('');
}

function renderUpcomingEvents(events) {
  console.log('🎨 Rendering upcoming events:', events.length);
  
  if (events.length === 0) {
    console.log('📭 No events to render, showing empty state');
    upcomingEventsContainer.innerHTML = '<p>No upcoming events right now. Check back soon!</p>';
    return;
  }
  
  // No longer tracking seen events since we removed the "New" tags
  
  upcomingEventsContainer.innerHTML = events.map(ev => {
    const start = new Date(ev.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    const end = new Date(ev.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    const isMainEvent = ev.isMainEvent;
    const isWorkshop = ev.category === 'workshop';
    const isHackathon = ev.category === 'hackathon';
    const isSymposium = ev.category === 'tech-symposium';
    const isGuestLecture = ev.category === 'guest-lecture';
    const hasEventLink = ev.eventLink && ev.eventLink.trim() !== '';
    const hasGoogleForm = ev.googleFormLink && ev.googleFormLink.trim() !== '';
    const hasFormLink = ev.formLink && ev.formLink.trim() !== '';
    
    // No longer checking for new events
    
    // Get category display name
    let categoryDisplay = ev.category.replace('-', ' ');
    if (ev.subCategory) {
      categoryDisplay += ` (${ev.subCategory})`;
    }
    
    // Get event type indicator
    let eventTypeIndicator = '';
    if (ev.eventType) {
      if (ev.eventType.intraDept) eventTypeIndicator = '🏢 Intra-Dept';
      else if (ev.eventType.interDept) eventTypeIndicator = '🏢 Inter-Dept';
      if (ev.eventType.online) eventTypeIndicator += ' 🌐 Online';
      else if (ev.eventType.offline) eventTypeIndicator += ' 📍 Offline';
      else if (ev.eventType.hybrid) eventTypeIndicator += ' 🔄 Hybrid';
    }
    
    // Render sub-events if this is a main event
    let subEventsHTML = '';
    if (isMainEvent && ev.subEvents && ev.subEvents.length > 0) {
      subEventsHTML = `
        <div class="sub-events">
          <h4>📋 Sub-Events (${ev.subEvents.length})</h4>
          <div class="sub-events-list">
            ${ev.subEvents.map(subEvent => {
              const subStart = new Date(subEvent.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
              const subEnd = new Date(subEvent.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
              return `
                <div class="sub-event-item">
                  <div class="sub-event-header">
                    <strong>${subEvent.title}</strong>
                    <span class="sub-event-category">${subEvent.subCategory || 'Event'}</span>
                  </div>
                  <div class="sub-event-details">
                    <span>📅 ${subStart === subEnd ? subStart : `${subStart} - ${subEnd}`}</span>
                    <span>📍 ${subEvent.venue || 'TBA'}</span>
                    <span>👥 Max: ${subEvent.maxParticipants || 'Unlimited'}</span>
                  </div>
                  <p class="sub-event-description">${subEvent.description ? subEvent.description.substring(0, 80) + '...' : 'No description'}</p>
                </div>
              `;
            }).join('')}
          </div>
        </div>
      `;
    }
    
    return `
      <div class="event-card ${isMainEvent ? 'main-event' : ''}">
        <div class="event-header">
          <h3>${ev.title}</h3>
          <span class="event-category">${categoryDisplay}</span>
          ${isMainEvent ? '<span class="main-event-badge">🏆 Main Event</span>' : ''}
        </div>
        <div class="event-details">
          <p class="event-date">📅 ${start === end ? start : `${start} - ${end}`}</p>
          <p class="event-venue">📍 ${ev.venue || 'Venue TBA'}</p>
          <p class="event-description">${ev.description ? ev.description.substring(0, 100) + '...' : 'No description available'}</p>
          ${eventTypeIndicator ? `<p class="event-type">${eventTypeIndicator}</p>` : ''}
          ${subEventsHTML}
        </div>
        <div class="event-actions">
          <button onclick="viewEventDetails('${ev._id}')">View Details</button>
          ${isMainEvent && hasGoogleForm ? `
            <button class="register-now-btn" onclick="window.open('${ev.googleFormLink}', '_blank')">Register for Main Event</button>
          ` : ''}
          ${isWorkshop && hasFormLink ? `
            <button class="register-now-btn" onclick="window.open('${ev.formLink}', '_blank')">Register Now</button>
          ` : ''}
          ${isWorkshop && hasEventLink ? `
            <button class="register-now-btn" onclick="window.open('${ev.eventLink}', '_blank')">Register Now</button>
          ` : ''}
          ${isHackathon && hasFormLink ? `
            <button class="register-now-btn" onclick="window.open('${ev.formLink}', '_blank')">Register Now</button>
          ` : isHackathon ? `
            <button class="register-now-btn" onclick="registerForEvent('${ev._id}')">Register for Hackathon</button>
          ` : ''}
          ${isSymposium ? `
            <button class="register-now-btn" onclick="registerForEvent('${ev._id}')">Register for Symposium</button>
          ` : ''}
          ${isGuestLecture ? `
            <button class="register-now-btn" onclick="registerForEvent('${ev._id}')">Register for Lecture</button>
          ` : ''}
        </div>
      </div>
    `;
  }).join('');
}

if (refreshUpcomingBtn) {
  refreshUpcomingBtn.addEventListener('click', async () => {
    // Clear seen events to show all events as new
    localStorage.removeItem('seenEvents');
    localStorage.removeItem('seenNotifications');
    
    // Show loading state
    if (upcomingEventsContainer) {
      upcomingEventsContainer.innerHTML = createSkeletonCards(4);
    }
    
    // Fetch fresh events
    await fetchUpcomingEvents(true); // Reset pagination
    
    // Check for new notifications
    await checkForNewNotifications();
    
    // Show success message
    showSuccess('Events refreshed successfully!');
  });
}

// Load more events functionality
if (loadMoreEventsBtn) {
  loadMoreEventsBtn.addEventListener('click', async () => {
    if (hasMoreEvents) {
      currentEventPage++;
      await fetchUpcomingEvents(false); // Don't reset pagination
      showSuccess(`Loaded page ${currentEventPage} of events!`);
    }
  });
}

// Function to refresh all events (can be called from other parts of the app)
function refreshAllEvents() {
  fetchUpcomingEvents();
  loadEventsParticipated();
}

// Utility functions
function redirectToLogin() {
  window.location.href = '/login';
}

function showLoading() {
  loadingOverlay.style.display = 'flex';
}

function hideLoading() {
  loadingOverlay.style.display = 'none';
}

function showError(message) {
  // Create a simple error notification
  const notification = document.createElement('div');
  notification.className = 'notification error';
  notification.innerHTML = `
    <div style="
      position: fixed;
      top: 20px;
      right: 20px;
      background: #ffebee;
      color: #c62828;
      padding: 1rem;
      border-radius: 8px;
      border: 1px solid #ffcdd2;
      z-index: 3000;
      max-width: 300px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    ">
      <strong>Error:</strong> ${message}
    </div>
  `;
  
  document.body.appendChild(notification);
  
  // Remove after 5 seconds
  setTimeout(() => {
    if (notification.parentNode) {
      notification.parentNode.removeChild(notification);
    }
  }, 5000);
}

function showSuccess(message) {
  // Create a simple success notification
  const notification = document.createElement('div');
  notification.className = 'notification success';
  notification.innerHTML = `
    <div style="
      position: fixed;
      top: 20px;
      right: 20px;
      background: #e8f5e8;
      color: #2e7d32;
      padding: 1rem;
      border-radius: 8px;
      border: 1px solid #c8e6c9;
      z-index: 3000;
      max-width: 300px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      animation: slideIn 0.3s ease;
    ">
      <strong>Success:</strong> ${message}
    </div>
  `;
  
  // Add CSS animation
  const style = document.createElement('style');
  style.textContent = `
    @keyframes slideIn {
      from { transform: translateX(100%); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
  `;
  document.head.appendChild(style);
  
  document.body.appendChild(notification);
  
  // Remove after 5 seconds
  setTimeout(() => {
    if (notification.parentNode) {
      notification.parentNode.removeChild(notification);
    }
  }, 5000);
}

// Function to show notifications
function showNotification(message, type = 'info') {
  // Create a simple notification
  const notification = document.createElement('div');
  notification.className = `notification ${type}`;
  notification.innerHTML = `
    <div style="
      position: fixed;
      top: 20px;
      right: 20px;
      background: ${type === 'success' ? '#e8f5e8' : type === 'error' ? '#ffebee' : '#e3f2fd'};
      color: ${type === 'success' ? '#2e7d32' : type === 'error' ? '#c62828' : '#1565c0'};
      padding: 1rem;
      border-radius: 8px;
      border: 1px solid ${type === 'success' ? '#c8e6c9' : type === 'error' ? '#ffcdd2' : '#bbdefb'};
      z-index: 3000;
      max-width: 300px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      animation: slideIn 0.3s ease;
    ">
      ${message}
    </div>
  `;
  
  document.body.appendChild(notification);
  
  // Remove after 5 seconds
  setTimeout(() => {
    if (notification.parentNode) {
      notification.parentNode.removeChild(notification);
    }
  }, 5000);
}

// Global functions for onclick handlers
window.showPasswordChangeModal = showPasswordChangeModal;
window.closePasswordModal = closePasswordModal;
window.viewProfile = viewProfile;
window.viewNotifications = viewNotifications;
window.viewSchedule = viewSchedule; 
window.closeQuickActionsModal = closeQuickActionsModal;
window.closeRecentActivityModal = closeRecentActivityModal;
window.closeAcademicStatusModal = closeAcademicStatusModal;
window.closeProfileModal = closeProfileModal;
window.viewEventDetails = viewEventDetails;
window.registerForEvent = registerForEvent;
window.refreshAllEvents = refreshAllEvents;
window.showNotification = showNotification;