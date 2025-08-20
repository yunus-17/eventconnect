# EventConnect Event Management System

This document explains how the event management system works and how to test it.

## System Overview

The EventConnect system allows admins to create events through the admin dashboard, which are then automatically displayed in the user dashboard's upcoming events section.

## How It Works

### 1. Event Creation (Admin Dashboard)
- Admins can create events through the admin dashboard (`eventconnect-admin.html`)
- Events are created via the `/api/events` POST endpoint
- Events are stored in the MongoDB database using the Event model
- Events are automatically marked as "upcoming" if their start date is in the future

### 2. Event Display (User Dashboard)
- User dashboard fetches events from `/api/events?status=upcoming&limit=20`
- Events are filtered to show only those with future start dates
- Events are sorted by start date (earliest first)
- Events are displayed with visual indicators for new events

### 3. Real-time Updates
- User dashboard refreshes events every 10 seconds when visible
- User dashboard refreshes events every 30 seconds regardless of visibility
- Manual refresh button clears cached data and fetches fresh events
- New event notifications are shown when events are detected

## API Endpoints

### Event Management
- `GET /api/events` - Get all events (with optional filtering)
- `POST /api/events` - Create new event (admin only)
- `PUT /api/events/:id` - Update event (admin only)
- `DELETE /api/events/:id` - Delete event (admin only)

### Notifications
- `POST /api/events/notify-new-event` - Notify about new event (admin only)
- `GET /api/events/notifications/recent` - Get recent notifications

### Testing
- `POST /api/events/test/create-sample` - Create sample event for testing

## Testing the System

### Method 1: Using the Admin Dashboard
1. Start the server: `npm start`
2. Open admin dashboard: `http://localhost:3000/eventconnect-admin.html`
3. Login as admin
4. Create a new event (workshop, hackathon, etc.)
5. Open user dashboard: `http://localhost:3000/user-dashboard.html`
6. Login as student
7. Check the "Upcoming Events" section - the new event should appear within 10-30 seconds

### Method 2: Using the Test Endpoint
1. Start the server: `npm start`
2. Create a sample event:
   ```bash
   curl -X POST http://localhost:3000/api/events/test/create-sample
   ```
3. Open user dashboard and check for the sample event

### Method 3: Using the Test Script
1. Start the server: `npm start`
2. Run the test script:
   ```bash
   node test-events.js
   ```

## Event Types

### Regular Events
- **Workshops**: Technical training sessions
- **Hackathons**: Coding competitions
- **Tech Symposiums**: Academic events with sub-events
- **Guest Lectures**: Expert presentations

### Department Events
- **Intra-Department**: Events within a single department
- **Inter-Department**: Events across multiple departments
- **Main Events**: Container events that contain multiple sub-events

## Event Status

Events can have the following statuses:
- `upcoming`: Event hasn't started yet
- `ongoing`: Event is currently happening
- `completed`: Event has finished
- `cancelled`: Event was cancelled

## Date Handling

- **Start Date**: When the event begins
- **End Date**: When the event ends
- **Registration Deadline**: Last date to register
- **Filtering**: Only events with start dates in the future are shown as "upcoming"

## Visual Indicators

### New Events
- Orange border with pulsing animation
- "🆕 New" badge with bounce animation
- Success notification when detected

### Main Events
- Green border
- "🏆 Main Event" badge
- Contains sub-events

### Event Categories
- Different colors and icons for each category
- Category-specific registration buttons

## Troubleshooting

### Events Not Appearing
1. Check if event start date is in the future
2. Check if event status is "upcoming"
3. Check browser console for API errors
4. Try manual refresh button

### API Errors
1. Check server logs for errors
2. Verify database connection
3. Check authentication tokens
4. Verify API endpoint URLs

### Performance Issues
1. Reduce refresh frequency if needed
2. Check database indexes
3. Monitor server resources

## Database Schema

### Event Model
```javascript
{
  title: String,
  description: String,
  category: String,
  domain: String,
  posterUrl: String,
  startDate: Date,
  endDate: Date,
  duration: String,
  coordinatorName: String,
  coordinatorEmail: String,
  venue: String,
  maxParticipants: Number,
  registrationDeadline: Date,
  status: String,
  createdBy: ObjectId,
  createdAt: Date,
  updatedAt: Date
}
```

## Future Enhancements

1. **WebSocket Integration**: Real-time updates without polling
2. **Push Notifications**: Browser notifications for new events
3. **Event Categories**: More specific event types
4. **Registration System**: Allow users to register for events
5. **Event Analytics**: Track event popularity and engagement
6. **Email Notifications**: Send emails for new events
7. **Mobile App**: Native mobile application

## Support

For issues or questions:
1. Check the browser console for errors
2. Check the server logs
3. Verify the database connection
4. Test with the sample endpoints
5. Review this documentation
