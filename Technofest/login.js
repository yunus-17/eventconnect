// DOM Elements
const typeButtons = document.querySelectorAll('.type-btn');
const studentForm = document.getElementById('studentLoginForm');
const adminForm = document.getElementById('adminLoginForm');
const loadingMessage = document.getElementById('loadingMessage');
const errorMessage = document.getElementById('errorMessage');
const successMessage = document.getElementById('successMessage');
const errorText = document.getElementById('errorText');
const successText = document.getElementById('successText');

// API Base URL
const API_BASE_URL = window.location.origin;

// Login Type Switcher
typeButtons.forEach(button => {
  button.addEventListener('click', () => {
    const type = button.dataset.type;
    console.log('Switching to login type:', type);
    
    // Update active button
    typeButtons.forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');
    
    // Show/hide forms
    if (type === 'student') {
      studentForm.classList.add('active');
      adminForm.classList.remove('active');
      console.log('Student form activated');
    } else {
      adminForm.classList.add('active');
      studentForm.classList.remove('active');
      console.log('Admin form activated');
    }
    
    // Clear messages
    hideAllMessages();
  });
});

// Student Login Form Handler
studentForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const formData = new FormData(studentForm);
  const data = {
    rollNumber: formData.get('rollNumber'),
    password: formData.get('password')
  };
  
  await handleLogin('student', data);
});

// Admin Login Form Handler
adminForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  console.log('Admin form submitted');
  
  const formData = new FormData(adminForm);
  const data = {
    email: formData.get('email'),
    password: formData.get('password')
  };
  
  console.log('Admin form data:', data);
  await handleLogin('admin', data);
});

// Additional event listener for admin login button
document.addEventListener('DOMContentLoaded', () => {
  const adminLoginBtn = adminForm.querySelector('.login-btn');
  if (adminLoginBtn) {
    adminLoginBtn.addEventListener('click', async (e) => {
      e.preventDefault();
      console.log('Admin login button clicked');
      
      // Get form data manually
      const emailInput = document.getElementById('adminEmail');
      const passwordInput = document.getElementById('adminPassword');
      
      const data = {
        email: emailInput ? emailInput.value.trim() : '',
        password: passwordInput ? passwordInput.value.trim() : ''
      };
      
      console.log('Manual admin form data:', JSON.stringify(data));
      await handleLogin('admin', data);
    });
  }
});

// Generic Login Handler
async function handleLogin(type, data) {
  try {
    console.log(`Attempting ${type} login with data:`, JSON.stringify(data));
    
    // Show loading
    showLoading();
    
    // Validate data
    if (!validateLoginData(type, data)) {
      console.log('Validation failed for', type, 'login');
      return;
    }
    
    console.log('Validation passed, making API call to:', `${API_BASE_URL}/api/auth/${type}-login`);
    
    // Make API call
    const response = await fetch(`${API_BASE_URL}/api/auth/${type}-login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    
    console.log('API response status:', response.status);
    const result = await response.json();
    console.log('API response data:', result);
    
    if (result.success) {
      // Store token and user data
      localStorage.setItem('token', result.token);
      localStorage.setItem('user', JSON.stringify(result.user));
      
      // Show success message
      showSuccess(result.message);
      
      console.log('Login successful, redirecting to:', result.redirectTo);
      
      // Redirect after a short delay
      setTimeout(() => {
        window.location.href = result.redirectTo;
      }, 1500);
      
    } else {
      // Show error message
      console.error('Login failed:', result.message);
      showError(result.message || 'Login failed');
    }
    
  } catch (error) {
    console.error('Login error:', error);
    showError('Network error. Please check if the server is running and try again.');
  } finally {
    hideLoading();
  }
}

// Validation Functions
function validateLoginData(type, data) {
  console.log(`Validating ${type} login data:`, JSON.stringify(data));
  
  if (type === 'student') {
    if (!data.rollNumber || !data.password) {
      showError('Please fill in all fields');
      return false;
    }
    
    // Validate roll number format
    const rollNumberPattern = /^\d{2}[A-Z]{2,3}\d{3}$/;
    if (!rollNumberPattern.test(data.rollNumber)) {
      showError('Roll number must be in format: 22IT101 or 23ITR001');
      return false;
    }
    
  } else if (type === 'admin') {
    if (!data.email || !data.password) {
      showError('Please fill in all fields');
      return false;
    }
    
    // Validate email format
    const emailPattern = /^[^\s@]+@kongu\.edu$/;
    if (!emailPattern.test(data.email)) {
      showError('Admin username must be in the format username@kongu.edu');
      return false;
    }
  }
  
  console.log('Validation passed for', type, 'login');
  return true;
}

// Message Display Functions
function showLoading() {
  hideAllMessages();
  loadingMessage.style.display = 'block';
}

function hideLoading() {
  loadingMessage.style.display = 'none';
}

function showError(message) {
  hideAllMessages();
  errorText.textContent = message;
  errorMessage.style.display = 'block';
}

function showSuccess(message) {
  hideAllMessages();
  successText.textContent = message;
  successMessage.style.display = 'block';
}

function hideAllMessages() {
  loadingMessage.style.display = 'none';
  errorMessage.style.display = 'none';
  successMessage.style.display = 'none';
}

// Check if user is already logged in (only clear invalid data, don't redirect)
function checkAuthStatus() {
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user');
  
  if (token && user) {
    try {
      const userData = JSON.parse(user);
      // Just validate the data, don't redirect from login page
      console.log('User already logged in:', userData.role);
    } catch (error) {
      // Clear invalid data
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  checkAuthStatus();
  
  // Add input validation feedback
  const inputs = document.querySelectorAll('input');
  inputs.forEach(input => {
    input.addEventListener('blur', () => {
      validateInput(input);
    });
    
    input.addEventListener('input', () => {
      // Clear error messages when user starts typing
      if (errorMessage.style.display === 'block') {
        hideAllMessages();
      }
    });
  });
});

// Input validation
function validateInput(input) {
  const value = input.value.trim();
  
  if (input.type === 'email' && value) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(value)) {
      input.style.borderColor = '#c62828';
    } else {
      input.style.borderColor = '#4caf50';
    }
  }
  
  if (input.name === 'rollNumber' && value) {
    const rollNumberPattern = /^\d{2}[A-Z]{2,3}\d{3}$/;
    if (!rollNumberPattern.test(value)) {
      input.style.borderColor = '#c62828';
    } else {
      input.style.borderColor = '#4caf50';
    }
  }
  
  if (input.type === 'password' && value.length < 1) {
    input.style.borderColor = '#c62828';
  } else if (input.type === 'password' && value.length >= 1) {
    input.style.borderColor = '#4caf50';
  }
} 