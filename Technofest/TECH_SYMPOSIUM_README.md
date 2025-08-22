# Tech Symposium Management - EventConnect Admin Dashboard

## Overview
The Tech Symposium section in the EventConnect Admin Dashboard allows administrators to create, manage, edit, and delete tech symposium events. All data is stored in MongoDB Atlas cloud database.

## Features

### 1. Create Tech Symposium
- **Form Fields:**
  - Symposium Title
  - Theme/Topic
  - Organizer/Coordinator
  - Department (dropdown with all engineering departments)
  - Start Date & End Date
  - Registration Deadline
  - Venue
  - Mode (Online/Offline/Hybrid)
  - Max Participants
  - Poster Link (URL)
  - Description
  - Keynote Speakers (optional)
  - Schedule (optional)

### 2. Special Features
- Paper Presentation
- Project Exhibition
- Technical Quiz
- Poster Presentation
- Certificates Provided
- External Participants Allowed
- Requires Laptop

### 3. Eligibility
- 2nd Year Students
- 3rd Year Students
- 4th Year Students
- Final Year Students

### 4. Management Features
- **View:** Display all tech symposiums in card format
- **Edit:** Update symposium details (title and description via prompts)
- **Delete:** Remove symposiums from the database
- **Validation:** Form validation for all required fields

## Technical Implementation

### Frontend
- **HTML:** `eventconnect-admin.html` - Tech symposium form and display section
- **JavaScript:** `eventconnect-admin.js` - All CRUD operations and UI logic
- **CSS:** `eventconnect-admin.css` - Styling (reuses workshop card styles)

### Backend
- **Model:** `models/Event.js` - MongoDB schema with `additionalFields` for symposium-specific data
- **Routes:** `routes/events.js` - RESTful API endpoints (GET, POST, PUT, DELETE)
- **Database:** MongoDB Atlas cloud storage

### API Endpoints
- `GET /api/events?category=tech-symposium` - Fetch all tech symposiums
- `POST /api/events` - Create new tech symposium
- `PUT /api/events/:id` - Update existing symposium
- `DELETE /api/events/:id` - Delete symposium

### Data Structure
```javascript
{
  title: "Symposium Title",
  description: "Description",
  category: "tech-symposium",
  domain: "Theme/Topic",
  posterUrl: "URL",
  startDate: "Date",
  endDate: "Date",
  duration: "Calculated days",
  coordinatorName: "Organizer",
  coordinatorEmail: "admin@kongu.edu",
  venue: "Venue",
  maxParticipants: Number,
  registrationDeadline: "Date",
  eventType: { intraDept: true, interDept: false, online: false, offline: true },
  certificationProvided: Boolean,
  additionalFields: {
    theme: "Theme",
    department: "Department",
    mode: "Mode",
    keynoteSpeakers: "Speakers",
    schedule: "Schedule",
    specialFeatures: ["Feature1", "Feature2"],
    eligibility: ["2nd Year", "3rd Year"],
    externalParticipants: Boolean,
    requiresLaptop: Boolean
  }
}
```

## Usage

1. **Access:** Navigate to the EventConnect Admin Dashboard
2. **Select:** Click on "Tech Symposiums" in the sidebar
3. **Create:** Click "Add Tech Symposium" button
4. **Fill:** Complete the form with symposium details
5. **Submit:** Click "Submit" to save to database
6. **Manage:** Use Edit/Delete buttons on symposium cards

## Validation Rules

- All required fields must be filled
- End date must be after start date
- Registration deadline must be before start date
- Max participants must be at least 1
- At least one eligible year group must be selected

## Security

- Admin authentication required for all operations
- JWT token validation
- Form validation on both frontend and backend
- SQL injection protection via Mongoose

## Database Integration

- **MongoDB Atlas:** Cloud-hosted database
- **Collections:** Events collection stores all symposium data
- **Indexing:** Optimized queries for category and date filtering
- **Relationships:** Events linked to admin users via `createdBy` field

## Future Enhancements

1. **Advanced Editing:** Full form population for editing
2. **Bulk Operations:** Import/export symposium data
3. **Analytics:** Registration statistics and reports
4. **Notifications:** Email alerts for deadlines
5. **File Upload:** Direct poster image upload
6. **Search/Filter:** Advanced filtering options
