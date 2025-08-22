// Simple test to verify CGPA setup
console.log('🧪 Testing CGPA Setup...');

// Test 1: Check if required files exist
const fs = require('fs');
const path = require('path');

console.log('\n📋 Test 1: File Existence Check');

const requiredFiles = [
  'models/Student.js',
  'routes/auth.js',
  'login.js',
  'user-dashboard.js',
  'seedStudents.js',
  'data/cgpaMap.js'
];

requiredFiles.forEach(file => {
  const filePath = path.join(__dirname, file);
  if (fs.existsSync(filePath)) {
    console.log(`✅ ${file} exists`);
  } else {
    console.log(`❌ ${file} missing`);
  }
});

// Test 2: Check if Student model can be loaded
console.log('\n📋 Test 2: Model Loading Test');
try {
  // This will fail without proper MongoDB connection, but we can check syntax
  const AcademicStudentModel = require('./models/Student');
  console.log('✅ AcademicStudent model syntax is valid');
  console.log('Model schema:', Object.keys(AcademicStudentModel.schema.paths));
} catch (error) {
  console.log('⚠️ Student model load failed (expected without MongoDB):', error.message);
}

// Test 3: Check if cgpaMap data is accessible
console.log('\n📋 Test 3: CGPA Data Check');
try {
  const cgpaMap = require('./data/cgpaMap');
  const studentCount = Object.keys(cgpaMap).length;
  console.log(`✅ CGPA map loaded with ${studentCount} students`);
  
  // Show a few examples
  const examples = Object.entries(cgpaMap).slice(0, 5);
  examples.forEach(([rollNumber, cgpa]) => {
    console.log(`  ${rollNumber}: ${cgpa}`);
  });
  
  if (studentCount > 0) {
    console.log(`✅ CGPA data is ready for seeding`);
  }
} catch (error) {
  console.log('❌ CGPA map load failed:', error.message);
}

// Test 4: Check auth.js modifications
console.log('\n📋 Test 4: Auth.js Modifications Check');
try {
  const authContent = fs.readFileSync(path.join(__dirname, 'routes/auth.js'), 'utf8');
  
  const checks = [
    { name: 'Student model import', pattern: /require\(['"]\.\.\/models\/Student['"]\)/ },
    { name: 'CGPA fetch logic', pattern: /Fetch academic data \(CGPA\) from Student model/ },
    { name: 'CGPA in response', pattern: /cgpa: academicData \? academicData\.cgpa : null/ }
  ];
  
  checks.forEach(check => {
    if (check.pattern.test(authContent)) {
      console.log(`✅ ${check.name} found`);
    } else {
      console.log(`❌ ${check.name} missing`);
    }
  });
} catch (error) {
  console.log('❌ Auth.js read failed:', error.message);
}

// Test 5: Check login.js modifications
console.log('\n📋 Test 5: Login.js Modifications Check');
try {
  const loginContent = fs.readFileSync(path.join(__dirname, 'login.js'), 'utf8');
  
  if (loginContent.includes('studentCgpa')) {
    console.log('✅ CGPA storage logic found in login.js');
  } else {
    console.log('❌ CGPA storage logic missing from login.js');
  }
} catch (error) {
  console.log('❌ Login.js read failed:', error.message);
}

// Test 6: Check user-dashboard.js modifications
console.log('\n📋 Test 6: User Dashboard Modifications Check');
try {
  const dashboardContent = fs.readFileSync(path.join(__dirname, 'user-dashboard.js'), 'utf8');
  
  const checks = [
    { name: 'CGPA from localStorage', pattern: /localStorage\.getItem\(['"]studentCgpa['"]\)/ },
    { name: 'Not Available fallback', pattern: /Not Available/ },
    { name: 'CGPA display update', pattern: /cgpaValue \? cgpaValue\.toFixed\(2\) : 'Not Available'/ }
  ];
  
  checks.forEach(check => {
    if (check.pattern.test(dashboardContent)) {
      console.log(`✅ ${check.name} found`);
    } else {
      console.log(`❌ ${check.name} missing`);
    }
  });
} catch (error) {
  console.log('❌ User dashboard read failed:', error.message);
}

console.log('\n✨ CGPA Setup Test Completed!');
console.log('\n📝 Next Steps:');
console.log('1. Ensure MongoDB is running and accessible');
console.log('2. Run: node seedStudents.js to populate the database');
console.log('3. Test login with a student account to see CGPA in action');
console.log('4. Use test-cgpa-functionality.js in browser console for frontend testing');
