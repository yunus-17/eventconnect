# Guest Lecture Management System

## Overview

The Guest Lecture Management System is a comprehensive feature within the EventConnect Admin Dashboard that allows administrators to create, manage, edit, and delete guest lectures. This system is fully integrated with MongoDB Cloud Atlas for persistent data storage and provides a complete CRUD (Create, Read, Update, Delete) interface.

## Features

### 1. Create Guest Lectures
- **Comprehensive Form**: Detailed form with multiple sections for complete guest lecture information
- **Speaker Information**: Capture speaker name, designation, and organization
- **Lecture Details**: Topic, description, poster/banner URL
- **Logistics**: Date, time, venue, mode (Offline/Online/Hybrid)
- **Audience Selection**: Mandatory for all students or specific year groups
- **Registration Details**: Deadline, max participants, certificate provision
- **Special Requirements**: Laptop requirements, pre-read materials
- **Coordinator Information**: Name and contact details

### 2. Special Features
- **Audience Targeting**: Flexible audience selection (all students or specific years)
- **Time Management**: Start and end time specification
- **Mode Selection**: Support for offline, online, and hybrid lectures
- **Certificate Tracking**: Option to provide certificates to participants
- **Special Requirements**: Track laptop requirements and pre-read materials

### 3. Management Capabilities
- **View All Lectures**: Display all created guest lectures in card format
- **Edit Functionality**: Update lecture details (currently basic title/description editing)
- **Delete Functionality**: Remove lectures with confirmation
- **Real-time Updates**: Immediate UI updates after operations

## Technical Implementation

### Frontend Components

#### HTML Structure (`eventconnect-admin.html`)
```html
<!-- Guest Lectures Content -->
<div class="content-section" id="guest-lectures-content">
  <h2>Manage Guest Lectures</h2>
  
  <!-- Add Button -->
  <div class="action-bar">
    <button id="addGuestLectureBtn" class="action-button">
      <i class="action-icon">➕</i> Add Guest Lecture
    </button>
  </div>
  
  <!-- Form Container -->
  <div id="guestLectureFormContainer" class="form-container" style="display: none;">
    <form id="guestLectureForm" class="admin-form">
      <!-- Comprehensive form with multiple sections -->
    </form>
  </div>
  
  <!-- Display Container -->
  <div id="guestLecturesContainer" class="cards-container">
    <!-- Guest lecture cards will be rendered here -->
  </div>
</div>
```

#### JavaScript Functionality (`eventconnect-admin.js`)

**Key Functions:**
- `initGuestLecturesUI()`: Initialize UI elements and event listeners
- `validateGuestLectureForm()`: Client-side form validation
- `loadAdminGuestLectures()`: Fetch existing lectures from backend
- `renderSavedGuestLecture()`: Render lecture cards from backend data
- `onDeleteGuestLecture()`: Delete lectures with backend integration
- `onEditGuestLecture()`: Edit lectures (basic implementation)

### Backend Integration

#### Data Structure
Guest lectures are stored using the generic `Event` model with category `'guest-lecture'` and specific data stored in `additionalFields`:

```javascript
{
  title: "Lecture Title",
  description: "Lecture description",
  category: "guest-lecture",
  domain: "Lecture Topic",
  posterUrl: "https://example.com/poster.jpg",
  startDate: "2024-03-15",
  endDate: "2024-03-15",
  duration: "1 day",
  coordinatorName: "Coordinator Name",
  coordinatorEmail: "admin@kongu.edu",
  venue: "Lecture Hall",
  maxParticipants: 200,
  registrationDeadline: "2024-03-10",
  eventType: { intraDept: true, interDept: false, online: false, offline: true },
  certificationProvided: true,
  additionalFields: {
    speakerName: "Dr. John Doe",
    speakerDesignation: "Senior Scientist, Company",
    lectureTopic: "Advanced Topics",
    startTime: "14:00",
    endTime: "16:00",
    mode: "Offline",
    mandatoryForAll: false,
    selectedYears: ["3rd Year", "4th Year"],
    specialRequirements: ["Bring Laptop"],
    coordinatorContact: "9876543210"
  }
}
```

#### API Endpoints
- **GET** `/api/events?category=guest-lecture`: Retrieve all guest lectures
- **POST** `/api/events`: Create new guest lecture
- **PUT** `/api/events/:id`: Update existing guest lecture
- **DELETE** `/api/events/:id`: Delete guest lecture

## Data Structure Details

### Core Event Fields
- `title`: Lecture title
- `description`: Detailed description/abstract
- `category`: Always "guest-lecture"
- `domain`: Lecture topic/theme
- `posterUrl`: Poster or banner image URL
- `startDate`/`endDate`: Lecture date (same for single-day events)
- `duration`: Always "1 day"
- `coordinatorName`/`coordinatorEmail`: Event coordinator details
- `venue`: Lecture venue or platform
- `maxParticipants`: Maximum number of participants
- `registrationDeadline`: Registration cutoff date
- `eventType`: Event type configuration
- `certificationProvided`: Whether certificates are provided

### Additional Fields (Guest Lecture Specific)
- `speakerName`: Name of the guest speaker
- `speakerDesignation`: Speaker's designation and organization
- `lectureTopic`: Specific topic of the lecture
- `startTime`/`endTime`: Lecture timing
- `mode`: Lecture mode (Offline/Online/Hybrid)
- `mandatoryForAll`: Whether attendance is mandatory for all students
- `selectedYears`: Array of eligible year groups
- `specialRequirements`: Array of special requirements
- `coordinatorContact`: Coordinator's contact number

## Usage Instructions

### For Administrators

1. **Access the Dashboard**
   - Open `eventconnect-admin.html`
   - Log in with admin credentials
   - Navigate to "Guest Lectures" section

2. **Create a New Guest Lecture**
   - Click "Add Guest Lecture" button
   - Fill in all required fields in the form
   - Select appropriate audience (all students or specific years)
   - Set registration details if applicable
   - Click "Submit" to save

3. **Manage Existing Lectures**
   - View all lectures in card format
   - Click "Edit" to modify basic details
   - Click "Delete" to remove lectures
   - Confirm deletion when prompted

### Form Validation Rules

**Required Fields:**
- Lecture title
- Speaker name and designation
- Lecture topic
- Description
- Lecture date
- Start and end time
- Venue
- Mode
- Coordinator name and contact

**Validation Logic:**
- End time must be after start time
- Registration deadline must be before lecture date
- If max participants is set, registration deadline is required
- If not mandatory for all, at least one year group must be selected
- Coordinator contact must be 10 digits

## Security Features

- **JWT Authentication**: All operations require valid admin token
- **Session Management**: Automatic redirect to login if session expires
- **Input Validation**: Both client-side and server-side validation
- **Error Handling**: Comprehensive error messages and logging

## Database Integration

### MongoDB Atlas Connection
- Uses existing MongoDB Atlas connection
- Leverages the generic `Event` model
- Stores category-specific data in `additionalFields`
- Maintains data consistency with other event types

### Data Persistence
- All guest lectures are permanently stored in MongoDB Atlas
- Data survives server restarts
- Supports concurrent access from multiple admin sessions

## Future Enhancements

### Planned Features
1. **Advanced Editing**: Full form-based editing instead of simple prompts
2. **Bulk Operations**: Select and manage multiple lectures at once
3. **Search and Filter**: Find lectures by speaker, topic, or date
4. **Export Functionality**: Export lecture data to CSV/PDF
5. **Email Notifications**: Automatic notifications for registration deadlines
6. **Attendance Tracking**: Track actual attendance vs. registrations

### Technical Improvements
1. **Real-time Updates**: WebSocket integration for live updates
2. **Image Upload**: Direct poster upload instead of URL input
3. **Rich Text Editor**: Enhanced description editing
4. **Calendar Integration**: Sync with institutional calendar
5. **API Rate Limiting**: Prevent abuse of API endpoints

## Testing

### Test Script
Use `test-guest-lecture.js` to verify API functionality:

```bash
node test-guest-lecture.js
```

### Manual Testing Checklist
- [ ] Create new guest lecture with all fields
- [ ] Validate form error messages
- [ ] Verify data is saved to MongoDB Atlas
- [ ] Test edit functionality
- [ ] Test delete functionality with confirmation
- [ ] Verify UI updates after operations
- [ ] Test session expiration handling

## Troubleshooting

### Common Issues

1. **Form Not Submitting**
   - Check browser console for JavaScript errors
   - Verify all required fields are filled
   - Ensure server is running

2. **Data Not Saving**
   - Check MongoDB Atlas connection
   - Verify admin authentication token
   - Check server logs for errors

3. **UI Not Updating**
   - Refresh the page
   - Check network connectivity
   - Verify JavaScript is enabled

### Error Messages
- "Session expired": Re-login as admin
- "Failed to create guest lecture": Check form data and server status
- "Delete failed": Verify lecture exists and permissions

## Support

For technical support or feature requests, please refer to the main EventConnect documentation or contact the development team.

---

**Last Updated**: March 2024  
**Version**: 1.0  
**Compatibility**: EventConnect Admin Dashboard v1.0
