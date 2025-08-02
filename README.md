# Event Management System - React Migration

A comprehensive event management system for Kongu Engineering College, migrated from vanilla HTML/CSS/JS to React with TypeScript.

## Features

### Authentication & Authorization
- **Common Login Page**: Students and admins use the same login interface
- **Role-based Access**: Automatic redirection based on user role
- **JWT Authentication**: Secure session management
- **Password Management**: Users can change their default passwords

### Student Features
- **Event Discovery**: Browse upcoming events by category
- **Event Registration**: Register for events with team support
- **Registration Management**: View and manage event registrations
- **Event Details**: Comprehensive event information and requirements

### Admin Features
- **Event Management**: Create, edit, and delete events
- **Category Support**: Workshops, Hackathons, Tech Symposiums, Guest Lectures
- **Dynamic Forms**: Category-specific event creation forms
- **Registration Tracking**: Monitor event registrations and participants

### Event Categories

#### Workshops
- Technical skill development sessions
- Hands-on learning experiences

#### Hackathons
- Multi-round competitive programming
- Team-based development challenges
- Round-wise scheduling and management

#### Tech Symposiums
- Intra-department and inter-department events
- Technical and non-technical sub-events
- Paper presentations, coding contests, web design

#### Guest Lectures
- Industry expert sessions
- Knowledge sharing events

## Technology Stack

### Frontend
- **React 18** with TypeScript
- **React Router** for navigation
- **Tailwind CSS** for styling
- **Axios** for API communication
- **Context API** for state management

### Backend
- **Node.js** with Express.js
- **MongoDB Atlas** for database
- **JWT** for authentication
- **bcrypt** for password hashing
- **Express Validator** for input validation

## Project Structure

```
├── frontend/                 # React application
│   ├── src/
│   │   ├── components/       # React components
│   │   ├── contexts/         # Context providers
│   │   ├── services/         # API services
│   │   ├── types/           # TypeScript definitions
│   │   └── App.tsx          # Main application
│   ├── public/              # Static assets
│   └── package.json         # Frontend dependencies
├── Technofest/              # Backend application
│   ├── models/              # MongoDB models
│   ├── routes/              # API routes
│   ├── middleware/          # Authentication middleware
│   └── server.js            # Express server
└── README.md               # Project documentation
```

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB Atlas account
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Technofest1
   ```

2. **Backend Setup**
   ```bash
   cd Technofest
   npm install
   ```

3. **Frontend Setup**
   ```bash
   cd ../frontend
   npm install
   ```

4. **Environment Configuration**
   
   Backend (`Technofest/config.env`):
   ```env
   PORT=4002
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   NODE_ENV=development
   ```
   
   Frontend (`frontend/.env`):
   ```env
   REACT_APP_API_URL=http://localhost:4002
   ```

### Running the Application

1. **Start the Backend Server**
   ```bash
   cd Technofest
   npm start
   ```
   Server runs on: http://localhost:4002

2. **Start the Frontend Application**
   ```bash
   cd frontend
   npm start
   ```
   Application runs on: http://localhost:3000

## Default Credentials

### Admin Login
- **Email**: admin@kongu.edu
- **Password**: admin@123

### Student Login
- **Roll Number**: 22IT101 (or other sample roll numbers)
- **Password**: kongu@123

## API Endpoints

### Authentication
- `POST /api/auth/student-login` - Student login
- `POST /api/auth/admin-login` - Admin login
- `POST /api/auth/logout` - Logout
- `GET /api/auth/profile` - Get user profile
- `POST /api/auth/change-password` - Change password

### Events
- `GET /api/events` - Get all events
- `GET /api/events/:id` - Get event by ID
- `POST /api/events` - Create event (Admin only)
- `PUT /api/events/:id` - Update event (Admin only)
- `DELETE /api/events/:id` - Delete event (Admin only)

### Registrations
- `POST /api/registrations` - Register for event
- `GET /api/registrations/my-registrations` - Get user registrations
- `GET /api/registrations/check/:eventId` - Check registration eligibility
- `DELETE /api/registrations/:id` - Cancel registration

## Database Schema

### Users Collection
- Students: rollNumber, name, department, year, password
- Admins: email, name, department, permissions, password

### Events Collection
- Basic info: title, description, category, domain
- Scheduling: startDate, endDate, registrationDeadline
- Details: venue, maxParticipants, coordinator info
- Special fields for hackathons (rounds) and symposiums (sub-events)

### Registrations Collection
- Links students to events
- Supports individual and team registrations
- Tracks registration status and results

## Key Features Implemented

✅ **Authentication System**: JWT-based with role separation
✅ **Responsive Design**: Mobile-friendly interface
✅ **Event Management**: Full CRUD operations for events
✅ **Registration System**: Individual and team registrations
✅ **Category-specific Forms**: Dynamic forms based on event type
✅ **Real-time Updates**: Context-based state management
✅ **Input Validation**: Client and server-side validation
✅ **Error Handling**: Comprehensive error management
✅ **Notifications**: Toast notifications for user feedback

## Future Enhancements

- [ ] Email notifications using nodemailer
- [ ] CSV export for participant lists
- [ ] Advanced search and filtering
- [ ] Event analytics and reporting
- [ ] File upload for event posters
- [ ] Calendar integration
- [ ] Mobile app development

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions, please contact the development team or create an issue in the repository.