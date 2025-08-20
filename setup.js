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
      // Core students with specific CGPA values
      {
        rollNumber: '23ITR099',
        name: 'Mohammed Yunus A',
        department: 'Information Technology',
        year: 3,
        role: 'student',
        password: 'kongu@123',
        cgpa: 7.74,
        attendance: 82.5
      },
      {
        rollNumber: '23ITR107',
        name: 'Nandeesh G',
        department: 'Information Technology',
        year: 3,
        role: 'student',
        password: 'kongu@123',
        cgpa: 8.20,
        attendance: 88.7
      },
      {
        rollNumber: '23ITR110',
        name: 'Naveena S',
        department: 'Information Technology',
        year: 3,
        role: 'student',
        password: 'kongu@123',
        cgpa: 8.40
      },
      {
        rollNumber: '23ITR117',
        name: 'Pranesh Babu T J',
        department: 'Information Technology',
        year: 3,
        role: 'student',
        password: 'kongu@123',
        cgpa: 8.10
      },
      // Additional students with realistic names
      {
        rollNumber: '23ITR001',
        name: 'ABISHA REBEKKAL T',
        department: 'Information Technology',
        year: 3,
        role: 'student',
        password: 'kongu@123',
        cgpa: 8.25
      },
      {
        rollNumber: '23ITR002',
        name: 'AMARNATH M',
        department: 'Information Technology',
        year: 3,
        role: 'student',
        password: 'kongu@123',
        cgpa: 7.85
      },
      {
        rollNumber: '23ITR003',
        name: 'ANBUCHELVAN A',
        department: 'Information Technology',
        year: 3,
        role: 'student',
        password: 'kongu@123',
        cgpa: 8.15
      },
      {
        rollNumber: '23ITR004',
        name: 'ANISHMA R S',
        department: 'Information Technology',
        year: 3,
        role: 'student',
        password: 'kongu@123',
        cgpa: 8.45
      },
      {
        rollNumber: '23ITR005',
        name: 'ANJANA B',
        department: 'Information Technology',
        year: 3,
        role: 'student',
        password: 'kongu@123',
        cgpa: 9.18
      },
      {
        rollNumber: '23ITR061',
        name: 'ILAYAKANTH H S',
        department: 'Information Technology',
        year: 3,
        role: 'student',
        password: 'kongu@123',
        cgpa: 6.61
      },
      {
        rollNumber: '23ITR075',
        name: 'KABESH M',
        department: 'Information Technology',
        year: 3,
        role: 'student',
        password: 'kongu@123',
        cgpa: 7.51
      },
      {
        rollNumber: '23ITR087',
        name: 'KRITHIKA S',
        department: 'Information Technology',
        year: 3,
        role: 'student',
        password: 'kongu@123',
        cgpa: 8.03
      },
      {
        rollNumber: '23ITR121',
        name: 'PRIYANKA K',
        department: 'Information Technology',
        year: 3,
        role: 'student',
        password: 'kongu@123',
        cgpa: 7.52
      },
      {
        rollNumber: '23ITR122',
        name: 'RAGHUL P',
        department: 'Information Technology',
        year: 3,
        role: 'student',
        password: 'kongu@123',
        cgpa: 9.07
      },
      {
        rollNumber: '23ITR145',
        name: 'SANTHOSH RAMESH',
        department: 'Information Technology',
        year: 3,
        role: 'student',
        password: 'kongu@123',
        cgpa: 7.3
      },
      {
        rollNumber: '23ITR152',
        name: 'SIVA SARAVANA KUMAR M',
        department: 'Information Technology',
        year: 3,
        role: 'student',
        password: 'kongu@123',
        cgpa: 7.18
      },
      {
        rollNumber: '23ITR182',
        name: 'YUVARAJ B',
        department: 'Information Technology',
        year: 3,
        role: 'student',
        password: 'kongu@123',
        cgpa: 7.31
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