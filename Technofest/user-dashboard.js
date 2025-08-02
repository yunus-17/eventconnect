// Student Dashboard JavaScript

// DOM Elements
const studentName = document.getElementById('studentName');
const rollNumber = document.getElementById('rollNumber');
const studentFullName = document.getElementById('studentFullName');
const department = document.getElementById('department');
const year = document.getElementById('year');
const createdAt = document.getElementById('createdAt');
const lastLogin = document.getElementById('lastLogin');
const loginTime = document.getElementById('loginTime');
const logoutBtn = document.getElementById('logoutBtn');
const passwordModal = document.getElementById('passwordModal');
const passwordChangeForm = document.getElementById('passwordChangeForm');
const loadingOverlay = document.getElementById('loadingOverlay');

// API Base URL
const API_BASE_URL = window.location.origin;

// Check authentication on page load
document.addEventListener('DOMContentLoaded', () => {
  checkAuth();
  loadStudentProfile();
  updateLoginTime();
});

// Authentication check
function checkAuth() {
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user');
  
  if (!token || !user) {
    redirectToLogin();
    return;
  }
  
  try {
    const userData = JSON.parse(user);
    if (userData.role !== 'student') {
      redirectToLogin();
      return;
    }
  } catch (error) {
    console.error('Error parsing user data:', error);
    redirectToLogin();
    return;
  }
}

// Load student profile
async function loadStudentProfile() {
  try {
    showLoading();
    
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/api/auth/profile`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to load profile');
    }
    
    const result = await response.json();
    
    if (result.success) {
      displayStudentInfo(result.user);
    } else {
      throw new Error(result.message || 'Failed to load profile');
    }
    
  } catch (error) {
    console.error('Error loading profile:', error);
    showError('Failed to load profile. Please try again.');
  } finally {
    hideLoading();
  }
}

// Display student information
function displayStudentInfo(user) {
  studentName.textContent = user.name;
  rollNumber.textContent = user.rollNumber;
  studentFullName.textContent = user.name;
  department.textContent = user.department;
  year.textContent = user.year;
  
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
    redirectToLogin();
  }
}

// Password change functionality
function showPasswordChangeModal() {
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
  // This could open a detailed profile modal or navigate to a profile page
  alert('Profile view functionality will be implemented here');
}

function viewNotifications() {
  // This could show notifications or navigate to a notifications page
  alert('Notifications functionality will be implemented here');
}

function viewSchedule() {
  // This could show class schedule or navigate to a schedule page
  alert('Class schedule functionality will be implemented here');
}

// Utility functions
function redirectToLogin() {
  window.location.href = '/';
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
    ">
      <strong>Success:</strong> ${message}
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