# Kongu Engineering College - Login System

A comprehensive login system for students and admins with role-based redirection, built with Node.js, Express, MongoDB, and modern web technologies.

## Features

### 🔐 Authentication System
- **Dual Login System**: Separate login forms for students and admins
- **JWT Token Authentication**: Secure session management
- **Password Hashing**: Bcrypt encryption for all passwords
- **Role-Based Access Control**: Different dashboards for students and admins

### 👨‍🎓 Student Features
- Login using unique roll number (format: 22IT101)
- Default password: `kongu@123`
- Password change functionality after first login
- Student dashboard with personal information
- Academic status overview

### 👨‍💼 Admin Features
- Login using email and password
- Default admin: `admin@kongu.edu` / `admin@123`
- Create new student accounts
- View all students in a table format
- System statistics and user management
- Password change functionality

### 🛡️ Security Features
- Input validation and sanitization
- Password strength requirements
- JWT token expiration (24 hours)
- Protected routes with middleware
- CORS enabled for cross-origin requests

## Technology Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB Atlas
- **Authentication**: JWT, bcryptjs
- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Validation**: express-validator
- **Styling**: Modern CSS with responsive design

## Project Structure

```
Technofest/
├── server.js                 # Main server file
├── package.json             # Dependencies and scripts
├── config.env              # Environment configuration
├── models/
│   └── User.js             # User model with discriminators
├── middleware/
│   └── auth.js             # Authentication middleware
├── routes/
│   └── auth.js             # Authentication routes
├── login.html              # Login page
├── login.css               # Login page styles
├── login.js                # Login page functionality
├── user-dashboard.html     # Student dashboard
├── admin-dashboard.html    # Admin dashboard
├── dashboard.css           # Dashboard styles
├── user-dashboard.js       # Student dashboard functionality
├── admin-dashboard.js      # Admin dashboard functionality
└── README.md              # This file
```

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB Atlas account
- Git

### 1. Clone the Repository
```bash
git clone <repository-url>
cd Technofest
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Edit `config.env` file:
```env
PORT=3000
MONGODB_URI=mongodb+srv://your_username:your_password@your_cluster.mongodb.net/kongu_login_db
JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_random
NODE_ENV=development
```

### 4. Set Up MongoDB Atlas
1. Create a MongoDB Atlas account
2. Create a new cluster
3. Get your connection string
4. Replace the MONGODB_URI in config.env

### 5. Start the Application
```bash
# Development mode with auto-restart
npm run dev

# Production mode
npm start
```

The application will be available at `http://localhost:3000`

## Usage

### Student Login
1. Navigate to the login page
2. Click "Student Login" tab
3. Enter roll number (format: 22IT101)
4. Enter password (default: `kongu@123`)
5. Click "Login"
6. You'll be redirected to the student dashboard

### Admin Login
1. Navigate to the login page
2. Click "Admin Login" tab
3. Enter email: `admin@kongu.edu`
4. Enter password: `admin@123`
5. Click "Login"
6. You'll be redirected to the admin dashboard

### Creating New Students (Admin Only)
1. Login as admin
2. Click "Create Student Account" button
3. Fill in the student details:
   - Roll Number (format: 22IT101)
   - Full Name
   - Department
   - Year (1-4)
4. Click "Create Student"
5. The student will be created with default password: `kongu@123`

## API Endpoints

### Authentication
- `POST /api/auth/student-login` - Student login
- `POST /api/auth/admin-login` - Admin login
- `POST /api/auth/change-password` - Change password
- `GET /api/auth/profile` - Get user profile
- `POST /api/auth/logout` - Logout
- `POST /api/auth/create-student` - Create student (admin only)

### Data
- `GET /api/students` - Get all students

## Database Schema

### User (Base Schema)
```javascript
{
  role: String,           // 'student' or 'admin'
  password: String,       // Hashed password
  isFirstLogin: Boolean,  // Track first login
  createdAt: Date,        // Account creation date
  lastLogin: Date         // Last login timestamp
}
```

### Student Schema
```javascript
{
  rollNumber: String,     // Unique roll number (22IT101)
  name: String,           // Full name
  department: String,     // Department name
  year: Number           // Year (1-4)
}
```

### Admin Schema
```javascript
{
  email: String,          // Unique email
  name: String,           // Full name
  department: String,     // Department (optional)
  permissions: [String]   // Array of permissions
}
```

## Security Considerations

1. **Password Security**: All passwords are hashed using bcrypt with salt rounds of 12
2. **JWT Tokens**: Tokens expire after 24 hours
3. **Input Validation**: All inputs are validated using express-validator
4. **CORS**: Configured for cross-origin requests
5. **Environment Variables**: Sensitive data stored in environment variables

## Default Accounts

### Admin Account
- **Email**: admin@kongu.edu
- **Password**: admin@123
- **Permissions**: read, write, delete, admin

### Sample Student Accounts
- **Roll Number**: 22IT101, **Password**: kongu@123
- **Roll Number**: 22CS102, **Password**: kongu@123
- **Roll Number**: 22EC103, **Password**: kongu@123

## Customization

### Adding New Departments
Edit the department options in `admin-dashboard.html`:
```html
<option value="New Department">New Department</option>
```

### Changing Default Passwords
Modify the default passwords in `server.js`:
```javascript
const defaultPassword = 'your_new_default_password';
```

### Styling
All styles are in CSS files:
- `login.css` - Login page styles
- `dashboard.css` - Dashboard styles

## Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Check your MongoDB Atlas connection string
   - Ensure your IP is whitelisted in Atlas
   - Verify username and password

2. **JWT Token Errors**
   - Check JWT_SECRET in config.env
   - Ensure token is being sent in Authorization header

3. **Port Already in Use**
   - Change PORT in config.env
   - Kill existing processes on port 3000

### Development Tips

1. **Enable Debug Logging**
   ```javascript
   console.log('Debug:', data);
   ```

2. **Check Network Tab**
   - Open browser dev tools
   - Monitor network requests for errors

3. **Database Queries**
   - Use MongoDB Compass for database inspection
   - Check Atlas dashboard for connection issues

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the troubleshooting section above

---

**Built with ❤️ for Kongu Engineering College** 