# Attendance Update System

This system provides random attendance percentages for all student roll numbers in the EventConnect application.

## What's Been Added

### 1. **Database Schema Update**
- Added `attendance` field to the Student model in `models/User.js`
- Attendance ranges from 0.0% to 100.0% with default value of 75.0%

### 2. **Scripts Created**

#### `update-attendance.js`
- Updates all existing students with random attendance percentages
- Generates realistic attendance between 65% and 95%
- Rounds to 1 decimal place for precision

#### Updated `create-students.js`
- Now includes random attendance when creating new students
- Same range: 65% to 95%

#### Updated `setup.js`
- Sample students now include attendance data
- Provides examples of realistic attendance values

### 3. **Frontend Integration**
- User dashboard now displays actual attendance from database
- Profile modal shows real attendance data
- Academic status modal reflects actual attendance

## How to Use

### Option 1: Update Existing Students
```bash
cd Technofest
node update-attendance.js
```

This will:
- Connect to MongoDB
- Find all existing students
- Generate random attendance for each student
- Save the updated data
- Show progress and summary

### Option 2: Create New Students with Attendance
```bash
cd Technofest
node create-students.js
```

This will:
- Create new students with random CGPA and attendance
- Each student gets unique random values

### Option 3: Run Complete Setup
```bash
cd Technofest
node setup.js
```

This will:
- Set up the database
- Create sample students with attendance data
- Initialize the system

## Attendance Distribution

The system generates realistic attendance percentages:
- **Range**: 65.0% to 95.0%
- **Distribution**: Most students have good attendance (realistic for college)
- **Precision**: Rounded to 1 decimal place
- **Examples**: 82.5%, 88.7%, 91.3%, etc.

## Database Changes

### Before
```javascript
// Student model had no attendance field
const studentSchema = new mongoose.Schema({
  rollNumber: String,
  name: String,
  department: String,
  year: Number,
  cgpa: Number
});
```

### After
```javascript
// Student model now includes attendance
const studentSchema = new mongoose.Schema({
  rollNumber: String,
  name: String,
  department: String,
  year: Number,
  cgpa: Number,
  attendance: {
    type: Number,
    default: 75.0,
    min: 0.0,
    max: 100.0
  }
});
```

## API Updates

The student login API now returns attendance data:
```json
{
  "success": true,
  "user": {
    "id": "...",
    "rollNumber": "23ITR001",
    "name": "Student Name",
    "department": "Information Technology",
    "year": 3,
    "cgpa": 8.25,
    "attendance": 82.5,
    "role": "student"
  }
}
```

## Frontend Display

- **Academic Status Modal**: Shows actual attendance percentage
- **Profile Modal**: Displays real attendance data
- **Dashboard**: Real-time attendance information
- **Format**: Always displayed with 1 decimal place (e.g., "82.5%")

## Notes

- Attendance is generated randomly but realistically
- Values are persistent in the database
- Each student gets a unique random attendance
- The system maintains data integrity
- All existing functionality remains unchanged

## Troubleshooting

If you encounter issues:

1. **Check MongoDB connection** in `config.env`
2. **Verify User model** has been updated
3. **Restart the server** after schema changes
4. **Check console logs** for detailed error messages

## Example Output

```
🔗 Connecting to MongoDB...
✅ Connected to MongoDB successfully!
📊 Updating attendance for all students...
📚 Found 190 students to update
📝 23ITR001: Student 23ITR001 - Attendance: 82.5%
📝 23ITR002: Student 23ITR002 - Attendance: 88.7%
📝 23ITR003: Student 23ITR003 - Attendance: 91.3%
✅ Updated 10 students so far...
...
📊 Summary:
✅ Successfully updated: 190 students
❌ Failed to update: 0 students
📚 Total students processed: 190
```
