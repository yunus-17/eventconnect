// EventConnect Admin Analytics JavaScript

// DOM Elements
document.addEventListener('DOMContentLoaded', () => {
  // Check authentication first
  const token = localStorage.getItem('token');
  if (!token) {
    alert('Authentication required. Please log in to access the analytics dashboard.');
    window.location.href = 'login.html';
    return;
  }
  
  // Navigation elements
  const menuToggle = document.getElementById('menu-toggle');
  const sidebar = document.querySelector('.sidebar');
  const logoutBtn = document.getElementById('logoutBtn');
  const adminName = document.getElementById('adminName');
  
  // Analytics elements
  const totalEvents = document.getElementById('totalEvents');
  const totalRegistrations = document.getElementById('totalRegistrations');
  const avgRegistrationsPerEvent = document.getElementById('avgRegistrationsPerEvent');
  const mostPopularCategory = document.getElementById('mostPopularCategory');
  const refreshDataBtn = document.getElementById('refreshDataBtn');
  const categoryFilter = document.getElementById('categoryFilter');
  const dateFilter = document.getElementById('dateFilter');
  const eventsTableBody = document.getElementById('eventsTableBody');
  
  // Chart elements
  const registrationChart = document.getElementById('registrationChart');
  let pieChart = null; // Will hold the Chart.js instance
  
  // Set admin name from localStorage if available
  const user = localStorage.getItem('user');
  if (user) {
    try {
      const userData = JSON.parse(user);
      adminName.textContent = userData.name || 'Admin';
    } catch (error) {
      console.error('Error parsing user data:', error);
    }
  }
  
  // Toggle sidebar on mobile
  menuToggle.addEventListener('click', () => {
    sidebar.classList.toggle('open');
  });
  
  // Logout functionality
  logoutBtn.addEventListener('click', () => {
    if (confirm('Are you sure you want to logout?')) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = 'login.html';
    }
  });
  
  // Submenu handling
  const submenuItems = document.querySelectorAll('.has-submenu');
  submenuItems.forEach(item => {
    item.addEventListener('click', function(e) {
      if (e.target === this.querySelector('a') || e.target.parentElement === this.querySelector('a')) {
        e.preventDefault();
        this.classList.toggle('open');
      }
    });
  });
  
  // Initialize analytics data
  loadAnalyticsData();
  
  // Event listeners for filters and refresh button
  categoryFilter.addEventListener('change', filterData);
  dateFilter.addEventListener('change', filterData);
  refreshDataBtn.addEventListener('click', loadAnalyticsData);
  
  // Socket.io integration for future real-time updates
  // This is a placeholder for future implementation
  function setupSocketConnection() {
    // This would be implemented when the backend supports Socket.io
    // Example implementation:
    /*
    const socket = io();
    
    socket.on('connect', () => {
      console.log('Connected to server for real-time updates');
    });
    
    socket.on('registration_update', (data) => {
      console.log('Received registration update:', data);
      // Update the specific event in the table and chart
      const updatedEvent = data.event;
      const eventIndex = window.fullEventData.findIndex(e => e.id === updatedEvent.id);
      
      if (eventIndex !== -1) {
        // Update the event in our dataset
        window.fullEventData[eventIndex].registrations = updatedEvent.registrations;
        
        // Re-apply any current filters
        const filteredData = filterData(window.fullEventData);
        
        // Update the UI with the new data
        updateEventsTable(filteredData);
        updateRegistrationChart(filteredData);
      }
    });
    
    socket.on('disconnect', () => {
      console.log('Disconnected from server');
    });
    */
  }
  
  // This function would be called when Socket.io is implemented
  // setupSocketConnection();
  
  // Global flag to toggle between mock data and real API
  // In production, set this to false to use real API
  window.useMockData = true;
  
  // Function to load analytics data
  function loadAnalyticsData() {
    // Show loading state
    eventsTableBody.innerHTML = '<tr><td colspan="5" style="text-align: center;">Loading data...</td></tr>';
    
    // Use the global flag to determine data source
    const dataPromise = window.useMockData ? fetchMockData() : fetchRealData();
    
    dataPromise
      .then(data => {
        // Store the full dataset for filtering
        window.fullEventData = data;
        
        // Update the UI with the data
        updateAnalyticsUI(data);
      })
      .catch(error => {
        console.error('Error loading analytics data:', error);
        eventsTableBody.innerHTML = `<tr><td colspan="4" style="text-align: center;">Error loading data: ${error.message || 'Unknown error'}. Please try again.</td></tr>`;
      });
  }
  
  // Function to filter data based on selected filters
  function filterData() {
    const categoryValue = categoryFilter.value;
    const dateValue = dateFilter.value;
    
    if (!window.fullEventData) return;
    
    let filteredData = [...window.fullEventData];
    
    // Apply category filter
    if (categoryValue !== 'all') {
      filteredData = filteredData.filter(event => event.category === categoryValue);
    }
    
    // Apply date filter
    if (dateValue !== 'all') {
      const now = new Date();
      const currentMonth = now.getMonth();
      const currentYear = now.getFullYear();
      
      filteredData = filteredData.filter(event => {
        const eventDate = new Date(event.date);
        
        if (dateValue === 'this-month') {
          return eventDate.getMonth() === currentMonth && eventDate.getFullYear() === currentYear;
        } else if (dateValue === 'last-month') {
          const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
          const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;
          return eventDate.getMonth() === lastMonth && eventDate.getFullYear() === lastMonthYear;
        } else if (dateValue === 'this-year') {
          return eventDate.getFullYear() === currentYear;
        }
        
        return true;
      });
    }
    
    // Update the UI with filtered data
    updateAnalyticsUI(filteredData);
  }
  
  // Function to update the analytics UI with data
  function updateAnalyticsUI(data) {
    // Calculate statistics
    const stats = calculateStatistics(data);
    
    // Update statistics display
    totalEvents.textContent = stats.totalEvents;
    totalRegistrations.textContent = stats.totalRegistrations;
    avgRegistrationsPerEvent.textContent = stats.avgRegistrationsPerEvent;
    mostPopularCategory.textContent = stats.mostPopularCategory;
    
    // Update table
    updateTable(data);
    
    // Update chart
    updateChart(stats.categoryData);
  }
  
  // Function to calculate statistics from data
  function calculateStatistics(data) {
    const totalEvents = data.length;
    const totalRegistrations = data.reduce((sum, event) => sum + event.registrations, 0);
    const avgRegistrationsPerEvent = totalEvents > 0 ? Math.round(totalRegistrations / totalEvents) : 0;
    
    // Calculate registrations by category
    const categoryData = {};
    data.forEach(event => {
      if (!categoryData[event.category]) {
        categoryData[event.category] = 0;
      }
      categoryData[event.category] += event.registrations;
    });
    
    // Find most popular category
    let mostPopularCategory = '-';
    let maxRegistrations = 0;
    
    for (const category in categoryData) {
      if (categoryData[category] > maxRegistrations) {
        maxRegistrations = categoryData[category];
        mostPopularCategory = formatCategoryName(category);
      }
    }
    
    return {
      totalEvents,
      totalRegistrations,
      avgRegistrationsPerEvent,
      mostPopularCategory,
      categoryData
    };
  }
  
  // Function to update the events table
  function updateTable(data) {
    if (data.length === 0) {
      eventsTableBody.innerHTML = '<tr><td colspan="5" style="text-align: center;">No data available</td></tr>';
      return;
    }
    
    // Sort data by registrations (descending)
    const sortedData = [...data].sort((a, b) => b.registrations - a.registrations);
    
    // Generate table rows
    const tableRows = sortedData.map(event => {
      // Determine if we should enable or disable the download button
      const hasRegistrations = event.registrations > 0;
      const downloadBtnClass = hasRegistrations ? 'download-btn' : 'download-btn disabled';
      const downloadBtnText = hasRegistrations ? 'Download CSV' : 'No registrations';
      
      return `
        <tr>
          <td>${event.name}</td>
          <td>${formatCategoryName(event.category)}</td>
          <td>${formatDate(event.date)}</td>
          <td>${event.registrations}</td>
          <td>
            <button class="${downloadBtnClass}" data-event-id="${event.id}" ${!hasRegistrations ? 'disabled' : ''}>
              ${downloadBtnText}
            </button>
          </td>
        </tr>
      `;
    }).join('');
    
    eventsTableBody.innerHTML = tableRows;
    
    // Add event listeners to download buttons
    document.querySelectorAll('.download-btn:not(.disabled)').forEach(button => {
      button.addEventListener('click', function() {
        const eventId = this.getAttribute('data-event-id');
        downloadRegistrationsCsv(eventId);
      });
    });
  }
  
  // Function to download registrations CSV for an event
  function downloadRegistrationsCsv(eventId) {
    // Show loading state on the button
    const button = document.querySelector(`button[data-event-id="${eventId}"]`);
    const originalText = button.textContent;
    button.textContent = 'Downloading...';
    button.disabled = true;
    
    // Get token from localStorage
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Authentication required. Please log in again.');
      window.location.href = 'login.html';
      return;
    }
    
    // In a real implementation, this would fetch the CSV from the backend API
    // For now, we'll simulate the download with mock data
    if (window.useMockData) {
      // Simulate network delay
      setTimeout(() => {
        // Find the event in our data
        const event = window.fullEventData.find(e => e.id == eventId);
        if (!event) {
          alert('Event not found');
          button.textContent = originalText;
          button.disabled = false;
          return;
        }
        
        // Generate mock CSV data
        const mockCsvData = generateMockCsvData(event);
        
        // Create a download link
        const blob = new Blob([mockCsvData], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = `registrations_${event.name.replace(/\s+/g, '_')}.csv`;
        document.body.appendChild(a);
        a.click();
        
        // Clean up
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        button.textContent = originalText;
        button.disabled = false;
      }, 1000);
    } else {
      // Real API implementation
      fetch(`/api/events/${eventId}/registrations/download`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to download registrations');
        }
        return response.blob();
      })
      .then(blob => {
        // Find the event in our data
        const event = window.fullEventData.find(e => e.id == eventId);
        if (!event) {
          throw new Error('Event not found');
        }
        
        // Create a download link
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = `registrations_${event.name.replace(/\s+/g, '_')}.csv`;
        document.body.appendChild(a);
        a.click();
        
        // Clean up
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      })
      .catch(error => {
        console.error('Error downloading registrations:', error);
        alert(`Error: ${error.message || 'Failed to download registrations'}`);
      })
      .finally(() => {
        button.textContent = originalText;
        button.disabled = false;
      });
    }
  }
  
  // Function to generate mock CSV data for an event
  function generateMockCsvData(event) {
    // CSV header
    let csv = 'Roll Number,Name,Email,Phone,Department,Year,Registration Date\n';
    
    // Generate random registrations based on the event's registration count
    const departments = ['CSE', 'ECE', 'EEE', 'MECH', 'CIVIL', 'IT'];
    const years = [1, 2, 3, 4];
    
    for (let i = 0; i < event.registrations; i++) {
      const rollNumber = `2023${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`;
      const name = `Student ${i + 1}`;
      const email = `student${i + 1}@example.com`;
      const phone = `9${Math.floor(Math.random() * 1000000000).toString().padStart(9, '0')}`;
      const department = departments[Math.floor(Math.random() * departments.length)];
      const year = years[Math.floor(Math.random() * years.length)];
      const regDate = new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      
      csv += `${rollNumber},${name},${email},${phone},${department},${year},${regDate}\n`;
    }
    
    return csv;
  }
  
  // Function to update the chart
  function updateChart(categoryData) {
    // Prepare data for chart
    const labels = [];
    const data = [];
    const backgroundColors = [];
    
    // Color mapping for categories
    const colorMap = {
      'workshop': '#4e73df',
      'hackathon': '#1cc88a',
      'tech-symposium': '#f6c23e',
      'guest-lecture': '#e74a3b'
    };
    
    for (const category in categoryData) {
      labels.push(formatCategoryName(category));
      data.push(categoryData[category]);
      backgroundColors.push(colorMap[category] || getRandomColor());
    }
    
    // Destroy existing chart if it exists
    if (pieChart) {
      pieChart.destroy();
    }
    
    // Create new chart
    pieChart = new Chart(registrationChart, {
      type: 'pie',
      data: {
        labels: labels,
        datasets: [{
          data: data,
          backgroundColor: backgroundColors,
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'right',
            labels: {
              font: {
                size: 14
              }
            }
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                const label = context.label || '';
                const value = context.raw || 0;
                const total = context.chart.data.datasets[0].data.reduce((a, b) => a + b, 0);
                const percentage = Math.round((value / total) * 100);
                return `${label}: ${value} (${percentage}%)`;
              }
            }
          }
        }
      }
    });
  }
  
  // Helper function to format category names
  function formatCategoryName(category) {
    switch (category) {
      case 'workshop':
        return 'Workshop';
      case 'hackathon':
        return 'Hackathon';
      case 'tech-symposium':
        return 'Tech Symposium';
      case 'guest-lecture':
        return 'Guest Lecture';
      default:
        return category.charAt(0).toUpperCase() + category.slice(1);
    }
  }
  
  // Helper function to format dates
  function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }
  
  // Helper function to generate random colors
  function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }
  
  // Mock data fetching function (simulates API call)
  function fetchMockData() {
    return new Promise((resolve) => {
      // Simulate network delay
      setTimeout(() => {
        const mockData = [
          {
            id: 1,
            name: 'Web Development Workshop',
            category: 'workshop',
            date: '2023-11-15',
            registrations: 78
          },
          {
            id: 2,
            name: 'AI/ML Hackathon',
            category: 'hackathon',
            date: '2023-11-20',
            registrations: 120
          },
          {
            id: 3,
            name: 'Cloud Computing Workshop',
            category: 'workshop',
            date: '2023-11-25',
            registrations: 65
          },
          {
            id: 4,
            name: 'Blockchain Basics',
            category: 'guest-lecture',
            date: '2023-11-10',
            registrations: 45
          },
          {
            id: 5,
            name: 'Annual Tech Symposium',
            category: 'tech-symposium',
            date: '2023-12-05',
            registrations: 200
          },
          {
            id: 6,
            name: 'Mobile App Development',
            category: 'workshop',
            date: '2023-12-10',
            registrations: 60
          },
          {
            id: 7,
            name: 'Cybersecurity Challenges',
            category: 'hackathon',
            date: '2023-12-15',
            registrations: 85
          },
          {
            id: 8,
            name: 'Industry 4.0',
            category: 'guest-lecture',
            date: '2023-12-20',
            registrations: 55
          },
          {
            id: 9,
            name: 'IoT Workshop',
            category: 'workshop',
            date: '2024-01-10',
            registrations: 70
          },
          {
            id: 10,
            name: 'Data Science Symposium',
            category: 'tech-symposium',
            date: '2024-01-20',
            registrations: 150
          },
          {
            id: 11,
            name: 'Game Development',
            category: 'workshop',
            date: '2024-01-25',
            registrations: 40
          },
          {
            id: 12,
            name: 'Quantum Computing',
            category: 'guest-lecture',
            date: '2024-02-05',
            registrations: 30
          }
        ];
        
        resolve(mockData);
      }, 500);
    });
  }
  
  // Function to fetch real data from API
  // This will replace the mock data function when backend is ready
  function fetchRealData() {
    // Get token from localStorage
    const token = localStorage.getItem('token');
    if (!token) {
      // Redirect to login if no token
      window.location.href = 'login.html';
      return Promise.reject('No authentication token');
    }
    
    return fetch('/api/events/analytics', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(response => {
      if (!response.success) {
        throw new Error(response.message || 'Failed to fetch analytics data');
      }
      return response.data; // The API now returns data in the correct format
    });
  }
});