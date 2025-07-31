#!/usr/bin/env node

/**
 * Setup script for Kongu Engineering College Login System
 * This script helps initialize the database with sample data
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: './config.env' });

// Import models
const { Student, Admin } = require('./models/User');

async function setupDatabase() {
  try {
    console.log('🔗 Connecting to MongoDB...');
    
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('✅ Connected to MongoDB successfully!');
    
    // Create default admin account
    console.log('👨‍💼 Creating default admin account...');
    await createDefaultAdmin();
    
    // Create sample students
    console.log('👨‍🎓 Creating sample student accounts...');
    await createSampleStudents();
    
    console.log('🎉 Database setup completed successfully!');
    console.log('\n📋 Default Accounts:');
    console.log('Admin: admin@kongu.edu / admin@123');
    console.log('Students: 22IT101, 22CS102, 22EC103 / kongu@123');
    
  } catch (error) {
    console.error('❌ Setup failed:', error.message);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

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
      console.log('✅ Default admin account created');
    } else {
      console.log('ℹ️  Admin account already exists');
    }
  } catch (error) {
    console.error('❌ Error creating admin:', error.message);
  }
}

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
      },
      {
        rollNumber: '22ME104',
        name: 'Sarah Wilson',
        department: 'Mechanical Engineering',
        year: 3,
        role: 'student',
        password: 'kongu@123'
      },
      {
        rollNumber: '22CE105',
        name: 'David Brown',
        department: 'Civil Engineering',
        year: 1,
        role: 'student',
        password: 'kongu@123'
      }
    ];

    let createdCount = 0;
    
    for (const studentData of sampleStudents) {
      const existingStudent = await Student.findOne({ rollNumber: studentData.rollNumber });
      
      if (!existingStudent) {
        const student = new Student(studentData);
        await student.save();
        createdCount++;
        console.log(`✅ Created student: ${studentData.rollNumber} - ${studentData.name}`);
      } else {
        console.log(`ℹ️  Student ${studentData.rollNumber} already exists`);
      }
    }
    
    console.log(`📊 Created ${createdCount} new student accounts`);
    
  } catch (error) {
    console.error('❌ Error creating students:', error.message);
  }
}

// Run setup if this file is executed directly
if (require.main === module) {
  setupDatabase();
}

module.exports = { setupDatabase }; 