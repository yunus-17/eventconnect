const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config({ path: './config.env' });

// Import routes
const authRoutes = require('./routes/auth');
const eventRoutes = require('./routes/events');
const registrationRoutes = require('./routes/registrations');

// Import models
const { Student, Admin } = require('./models/User');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use(express.static(path.join(__dirname)));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/registrations', registrationRoutes);

// Serve HTML pages
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'login.html'));
});

app.get('/home', (req, res) => {
  res.sendFile(path.join(__dirname, 'Home.html'));
});

app.get('/events', (req, res) => {
  res.sendFile(path.join(__dirname, 'Event.html'));
});

app.get('/user-dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, 'user-dashboard.html'));
});

app.get('/admin-dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, 'admin-dashboard.html'));
});

app.get('/admin-analytics', (req, res) => {
  res.sendFile(path.join(__dirname, 'admin-analytics.html'));
});

// API route to get all students (admin only)
app.get('/api/students', async (req, res) => {
  try {
    const students = await Student.find({}, { password: 0 });
    res.json({
      success: true,
      students
    });
  } catch (error) {
    console.error('Get students error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('Connected to MongoDB Atlas');
  
  // Create default admin account if it doesn't exist
  createDefaultAdmin();
  
  // Create some sample students if they don't exist
  createSampleStudents();
})
.catch((error) => {
  console.error('MongoDB connection error:', error);
  process.exit(1);
});

// Function to create default admin account
async function createDefaultAdmin() {
  try {
    const existingAdmin = await Admin.findOne({ email: 'admin@kongu.edu' });
    if (!existingAdmin) {
      const admin = new Admin({
        email: 'admin@kongu.edu',
        name: 'System Administrator',
        department: 'IT',
        role: 'admin',
        password: 'admin@123',
        permissions: ['read', 'write', 'delete', 'admin']
      });
      await admin.save();
      console.log('Default admin account created');
    }
  } catch (error) {
    console.error('Error creating default admin:', error);
  }
}

// Function to create sample students
async function createSampleStudents() {
  try {
    const sampleStudents = [
      {
        rollNumber: '22IT101',
        name: 'John Doe',
        department: 'Information Technology',
        year: 2,
        role: 'student',
        password: 'kongu@123'
      },
      {
        rollNumber: '22CS102',
        name: 'Jane Smith',
        department: 'Computer Science',
        year: 2,
        role: 'student',
        password: 'kongu@123'
      },
      {
        rollNumber: '22EC103',
        name: 'Mike Johnson',
        department: 'Electronics and Communication',
        year: 2,
        role: 'student',
        password: 'kongu@123'
      }
    ];

    for (const studentData of sampleStudents) {
      const existingStudent = await Student.findOne({ rollNumber: studentData.rollNumber });
      if (!existingStudent) {
        const student = new Student(studentData);
        await student.save();
        console.log(`Sample student ${studentData.rollNumber} created`);
      }
    }
  } catch (error) {
    console.error('Error creating sample students:', error);
  }
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Login page: http://localhost:${PORT}`);
  console.log(`Student Dashboard: http://localhost:${PORT}/user-dashboard`);
  console.log(`Admin Dashboard: http://localhost:${PORT}/admin-dashboard`);
});