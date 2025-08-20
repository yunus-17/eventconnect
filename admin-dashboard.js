// Admin Dashboard JavaScript

// DOM Elements
const adminName = document.getElementById('adminName');
const adminEmail = document.getElementById('adminEmail');
const adminFullName = document.getElementById('adminFullName');
const adminDepartment = document.getElementById('adminDepartment');
const adminPermissions = document.getElementById('adminPermissions');
const adminCreatedAt = document.getElementById('adminCreatedAt');
const adminLastLogin = document.getElementById('adminLastLogin');
const adminLoginTime = document.getElementById('adminLoginTime');
const logoutBtn = document.getElementById('logoutBtn');
const passwordModal = document.getElementById('passwordModal');
const passwordChangeForm = document.getElementById('passwordChangeForm');
const createStudentModal = document.getElementById('createStudentModal');
const createStudentForm = document.getElementById('createStudentForm');
const loadingOverlay = document.getElementById('loadingOverlay');
const studentsTableBody = document.getElementById('studentsTableBody');

// Statistics elements
const totalStudents = document.getElementById('totalStudents');
const totalAdmins = document.getElementById('totalAdmins');
const activeUsers = document.getElementById('activeUsers');
const newStudents = document.getElementById('newStudents');

// API Base URL
const API_BASE_URL = window.location.origin;

// Check authentication on page load
document.addEventListener('DOMContentLoaded', () => {
  checkAuth();
  loadAdminProfile();
  loadStudents();
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
    if (userData.role !== 'admin') {
      redirectToLogin();
      return;
    }
  } catch (error) {
    console.error('Error parsing user data:', error);
    redirectToLogin();
    return;
  }
}

// Load admin profile
async function loadAdminProfile() {
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
      displayAdminInfo(result.user);
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

// Display admin information
function displayAdminInfo(user) {
  adminName.textContent = user.name;
  adminEmail.textContent = user.email;
  adminFullName.textContent = user.name;
  adminDepartment.textContent = user.department || 'N/A';
  adminPermissions.textContent = user.permissions ? user.permissions.join(', ') : 'N/A';
  
  // Format dates
  if (user.createdAt) {
    adminCreatedAt.textContent = new Date(user.createdAt).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
  
  if (user.lastLogin) {
    adminLastLogin.textContent = new Date(user.lastLogin).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}

// Load students list
async function loadStudents() {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/api/students`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to load students');
    }
    
    const result = await response.json();
    
    if (result.success) {
      displayStudents(result.students);
      updateStatistics(result.students);
    } else {
      throw new Error(result.message || 'Failed to load students');
    }
    
  } catch (error) {
    console.error('Error loading students:', error);
    showError('Failed to load students. Please try again.');
  }
}

// Display students in table
function displayStudents(students) {
  studentsTableBody.innerHTML = '';
  
  if (students.length === 0) {
    studentsTableBody.innerHTML = `
      <tr>
        <td colspan="7" style="text-align: center; padding: 2rem; color: #666;">
          No students found
        </td>
      </tr>
    `;
    return;
  }
  
  students.forEach(student => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${student.rollNumber}</td>
      <td>${student.name}</td>
      <td>${student.department}</td>
      <td>${student.year}</td>
      <td>${new Date(student.createdAt).toLocaleDateString('en-US')}</td>
      <td>${student.lastLogin ? new Date(student.lastLogin).toLocaleString('en-US') : 'Never'}</td>
      <td>
        <button class="btn-secondary" onclick="viewStudent('${student._id}')" style="margin-right: 0.5rem; padding: 0.25rem 0.5rem; font-size: 0.8rem;">
          View
        </button>
        <button class="btn-primary" onclick="editStudent('${student._id}')" style="padding: 0.25rem 0.5rem; font-size: 0.8rem;">
          Edit
        </button>
      </td>
    `;
    studentsTableBody.appendChild(row);
  });
}

// Update statistics
function updateStatistics(students) {
  totalStudents.textContent = students.length;
  totalAdmins.textContent = '1'; // For now, just the default admin
  activeUsers.textContent = students.filter(s => s.lastLogin).length;
  
  // Count new students this month
  const thisMonth = new Date();
  thisMonth.setDate(1);
  thisMonth.setHours(0, 0, 0, 0);
  
  const newStudentsCount = students.filter(student => 
    new Date(student.createdAt) >= thisMonth
  ).length;
  
  newStudents.textContent = newStudentsCount;
}

// Update login time
function updateLoginTime() {
  const now = new Date();
  adminLoginTime.textContent = now.toLocaleTimeString('en-US', {
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

// Create student functionality
function showCreateStudentModal() {
  createStudentModal.style.display = 'block';
  createStudentForm.reset();
}

function closeCreateStudentModal() {
  createStudentModal.style.display = 'none';
}

// Create student form submission
createStudentForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const formData = new FormData(createStudentForm);
  const studentData = {
    rollNumber: formData.get('rollNumber'),
    name: formData.get('name'),
    department: formData.get('department'),
    year: parseInt(formData.get('year'))
  };
  
  // Validation
  if (!studentData.rollNumber || !studentData.name || !studentData.department || !studentData.year) {
    showError('Please fill in all fields');
    return;
  }
  
  // Validate roll number format
  const rollNumberPattern = /^\d{2}[A-Z]{2}\d{3}$/;
  if (!rollNumberPattern.test(studentData.rollNumber)) {
    showError('Roll number must be in format: 22IT101');
    return;
  }
  
  try {
    showLoading();
    
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/api/auth/create-student`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(studentData)
    });
    
    const result = await response.json();
    
    if (result.success) {
      showSuccess('Student account created successfully');
      closeCreateStudentModal();
      createStudentForm.reset();
      loadStudents(); // Reload the students list
    } else {
      showError(result.message || 'Failed to create student account');
    }
    
  } catch (error) {
    console.error('Create student error:', error);
    showError('Network error. Please try again.');
  } finally {
    hideLoading();
  }
});

// Password change functionality
function showPasswordChangeModal() {
  passwordModal.style.display = 'block';
  passwordChangeForm.reset();
}

function closePasswordModal() {
  passwordModal.style.display = 'none';
}

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
}

// Close modals when clicking outside
window.addEventListener('click', (event) => {
  if (event.target === passwordModal) {
    closePasswordModal();
  }
  if (event.target === createStudentModal) {
    closeCreateStudentModal();
  }
});

// Quick action functions
function viewAllStudents() {
  // Scroll to students table
  document.querySelector('.full-width').scrollIntoView({ behavior: 'smooth' });
}

function viewSystemStats() {
  // This could show detailed system statistics
  alert('Detailed system statistics will be implemented here');
}

function viewStudent(studentId) {
  // This could open a detailed student view modal
  alert(`View student details for ID: ${studentId}`);
}

function editStudent(studentId) {
  // This could open an edit student modal
  alert(`Edit student for ID: ${studentId}`);
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
window.showCreateStudentModal = showCreateStudentModal;
window.closeCreateStudentModal = closeCreateStudentModal;
window.showPasswordChangeModal = showPasswordChangeModal;
window.closePasswordModal = closePasswordModal;
window.viewAllStudents = viewAllStudents;
window.viewSystemStats = viewSystemStats;
window.viewStudent = viewStudent;
window.editStudent = editStudent; 