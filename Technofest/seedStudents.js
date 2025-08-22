const mongoose = require('mongoose');
const AcademicStudent = require('./models/Student');
const cgpaMap = require('./data/cgpaMap');

// Load environment variables from config.env
require('dotenv').config({ path: './config.env' });

// MongoDB connection string from config
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI not found in environment variables');
  console.error('Please check your config.env file');
  process.exit(1);
}

console.log('✅ MongoDB URI loaded from config.env');

async function seedStudents() {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing students collection
    await AcademicStudent.deleteMany({});
    console.log('Cleared existing students collection');

    // Prepare student data
    const students = Object.entries(cgpaMap).map(([rollNumber, cgpa]) => ({
      rollNumber,
      cgpa: cgpa === null || cgpa === '-' ? null : (typeof cgpa === 'number' ? cgpa : parseFloat(cgpa))
    }));

    // Insert all students
    const result = await AcademicStudent.insertMany(students);
    console.log(`Successfully inserted ${result.length} students`);

    // Verify the data
    const count = await AcademicStudent.countDocuments();
    console.log(`Total students in database: ${count}`);

    // Show a few examples
    const sampleStudents = await AcademicStudent.find().limit(5);
    console.log('\nSample students:');
    sampleStudents.forEach(student => {
      console.log(`${student.rollNumber}: CGPA = ${student.cgpa || 'Not Available'}`);
    });

    console.log('\nDatabase seeding completed successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    // Close the connection
    await mongoose.connection.close();
    console.log('MongoDB connection closed');
  }
}

// Run the seeding function
seedStudents();
