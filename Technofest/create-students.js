#!/usr/bin/env node

/**
 * Script to create 190 student accounts for Third Year IT
 * Roll Numbers: 23ITR001 to 23ITR190
 * Default Password: kongu@123
 */

const mongoose = require('mongoose');
require('dotenv').config({ path: './config.env' });

// Import Student model
const { Student } = require('./models/User');

async function createThirdYearITStudents() {
  try {
    console.log('🔗 Connecting to MongoDB...');
    
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('✅ Connected to MongoDB successfully!');
    console.log('👨‍🎓 Creating Third Year IT Student Accounts...');
    console.log('📊 Total students to create: 190 (23ITR001 to 23ITR190)');
    
    const students = [];
    let createdCount = 0;
    let skippedCount = 0;
    
    // Generate 190 students
    for (let i = 1; i <= 190; i++) {
      const rollNumber = `23ITR${i.toString().padStart(3, '0')}`;
      const studentName = `Student ${rollNumber}`;
      
      // Check if student already exists
      const existingStudent = await Student.findOne({ rollNumber });
      
      if (!existingStudent) {
        const studentData = {
          rollNumber: rollNumber,
          name: studentName,
          department: 'Information Technology',
          year: 3,
          role: 'student',
          password: 'kongu@123'
        };
        
        students.push(studentData);
        createdCount++;
        
        if (createdCount % 10 === 0) {
          console.log(`✅ Created ${createdCount} students so far...`);
        }
      } else {
        skippedCount++;
        console.log(`ℹ️  Student ${rollNumber} already exists, skipping...`);
      }
    }
    
    // Create all students in batch
    if (students.length > 0) {
      console.log(`\n📝 Creating ${students.length} new student accounts...`);
      
      for (const studentData of students) {
        const student = new Student(studentData);
        await student.save();
      }
      
      console.log(`✅ Successfully created ${students.length} new student accounts!`);
    }
    
    console.log('\n📊 Summary:');
    console.log(`✅ New students created: ${createdCount}`);
    console.log(`ℹ️  Students already existed: ${skippedCount}`);
    console.log(`📋 Total students in database: ${createdCount + skippedCount}`);
    
    console.log('\n🎓 Student Account Details:');
    console.log('Department: Information Technology');
    console.log('Year: 3rd Year');
    console.log('Roll Numbers: 23ITR001 to 23ITR190');
    console.log('Default Password: kongu@123');
    console.log('\n📝 Students can change their password after first login');
    
    // Show first 5 and last 5 roll numbers as examples
    console.log('\n📋 Example Roll Numbers:');
    console.log('First 5: 23ITR001, 23ITR002, 23ITR003, 23ITR004, 23ITR005');
    console.log('Last 5: 23ITR186, 23ITR187, 23ITR188, 23ITR189, 23ITR190');
    
  } catch (error) {
    console.error('❌ Error creating students:', error.message);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Disconnected from MongoDB');
    console.log('🎉 Third Year IT Student creation completed!');
  }
}

// Run the script
if (require.main === module) {
  createThirdYearITStudents();
}

module.exports = { createThirdYearITStudents }; 