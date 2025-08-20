// Startup script to test the EventConnect system
// This script will start the server and provide testing instructions

const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Starting EventConnect Test Environment...\n');

// Check if we're in the right directory
const packageJsonPath = path.join(__dirname, 'package.json');
const fs = require('fs');

if (!fs.existsSync(packageJsonPath)) {
  console.error('❌ Error: package.json not found. Please run this script from the Technofest directory.');
  process.exit(1);
}

console.log('📋 Testing Instructions:');
console.log('=======================\n');

console.log('1. 🏠 Admin Dashboard:');
console.log('   - Open: http://localhost:3000/eventconnect-admin.html');
console.log('   - Login as admin');
console.log('   - Create a new event (workshop, hackathon, etc.)\n');

console.log('2. 👤 User Dashboard:');
console.log('   - Open: http://localhost:3000/user-dashboard.html');
console.log('   - Login as student');
console.log('   - Check "Upcoming Events" section\n');

console.log('3. 🧪 Quick Test:');
console.log('   - Create a sample event:');
console.log('     curl -X POST http://localhost:3000/api/events/test/create-sample\n');

console.log('4. 📊 Expected Behavior:');
console.log('   - Events created in admin dashboard should appear in user dashboard within 10-30 seconds');
console.log('   - New events should have visual indicators (orange border, "🆕 New" badge)');
console.log('   - Success notifications should appear for new events\n');

console.log('5. 🔧 Troubleshooting:');
console.log('   - Check browser console for errors');
console.log('   - Check server logs for API errors');
console.log('   - Use manual refresh button if events don\'t appear automatically\n');

console.log('🎯 Starting server...\n');

// Start the server
const server = spawn('npm', ['start'], {
  cwd: __dirname,
  stdio: 'inherit',
  shell: true
});

server.on('error', (error) => {
  console.error('❌ Failed to start server:', error);
  process.exit(1);
});

server.on('close', (code) => {
  console.log(`\n🛑 Server stopped with code ${code}`);
});

// Handle process termination
process.on('SIGINT', () => {
  console.log('\n🛑 Stopping server...');
  server.kill('SIGINT');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Stopping server...');
  server.kill('SIGTERM');
  process.exit(0);
});
