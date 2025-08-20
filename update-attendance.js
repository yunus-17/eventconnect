const mongoose = require('mongoose');
require('dotenv').config({ path: './config.env' });

// Import Student model
const { Student } = require('./models/User');

async function updateAttendanceForAllStudents() {
  try {
    console.log('🔗 Connecting to MongoDB...');
    
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('✅ Connected to MongoDB successfully!');
    console.log('📊 Updating attendance for all students...');
    
    // Get all students
    const students = await Student.find({});
    console.log(`📚 Found ${students.length} students to update`);
    
    let updatedCount = 0;
    let skippedCount = 0;
    
    for (const student of students) {
      try {
        // Generate random attendance between 65% and 95%
        // This creates a realistic distribution where most students have good attendance
        const randomAttendance = Math.random() * 30 + 65; // 65% to 95%
        const roundedAttendance = Math.round(randomAttendance * 10) / 10; // Round to 1 decimal place
        
        // Update student attendance
        student.attendance = roundedAttendance;
        await student.save();
        
        updatedCount++;
        
        if (updatedCount % 10 === 0) {
          console.log(`✅ Updated ${updatedCount} students so far...`);
        }
        
        console.log(`📝 ${student.rollNumber}: ${student.name} - Attendance: ${roundedAttendance}%`);
        
      } catch (error) {
        console.error(`❌ Error updating ${student.rollNumber}:`, error.message);
        skippedCount++;
      }
    }
    
    console.log('\n📊 Summary:');
    console.log(`✅ Successfully updated: ${updatedCount} students`);
    console.log(`❌ Failed to update: ${skippedCount} students`);
    console.log(`📚 Total students processed: ${students.length}`);
    
    // Show some sample attendance data
    const sampleStudents = await Student.find({}).limit(5);
    console.log('\n📋 Sample attendance data:');
    sampleStudents.forEach(student => {
      console.log(`   ${student.rollNumber}: ${student.name} - ${student.attendance}%`);
    });
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    // Close the connection
    await mongoose.connection.close();
    console.log('🔌 MongoDB connection closed');
  }
}

// Run the function
updateAttendanceForAllStudents();
