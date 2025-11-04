# 🎓 Student Management System

A modern, full-stack web application for managing student information, departments, and sections in educational institutions. Built with the MERN stack (MongoDB, Express.js, React, Node.js).

![Project Status](https://img.shields.io/badge/status-production%20ready-brightgreen)
![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [Project Structure](#project-structure)
- [API Documentation](#api-documentation)
- [User Roles](#user-roles)
- [Screenshots](#screenshots)
- [Testing](#testing)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

## 🌟 Overview

The Student Management System is a comprehensive web-based solution designed to streamline the management of student records, departments, and sections in educational institutions. It provides role-based access control, allowing administrators and faculty members to efficiently manage student information, generate reports, and maintain organized academic records.

### Key Highlights

- **Modern UI/UX**: Built with React and shadcn/ui components
- **Secure Authentication**: JWT-based authentication with role-based access control
- **Real-time Updates**: Instant data synchronization across the application
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Comprehensive Reporting**: Generate and export reports in multiple formats
- **Production Ready**: Enterprise-level security and error handling


## ✨ Features

### 🔐 Authentication & Authorization
- Secure user registration and login
- JWT-based authentication
- Role-based access control (Admin/Faculty)
- Password encryption with bcrypt
- Account lockout after failed login attempts
- Session management

### 👥 Student Management
- Add, edit, and delete student records
- Search students by name or roll number
- Filter students by department and section
- View detailed student information
- Unique roll number and email validation
- Pagination for large datasets

### 🏢 Department & Section Management
- Create and manage departments
- Create sections under departments
- Track section capacity and current strength
- Department-wise student distribution
- Unique department codes and names

### 📊 Dashboard & Analytics
- Role-specific dashboards (Admin/Faculty)
- Real-time statistics and metrics
- Department-wise student distribution
- Quick action buttons
- Visual data representation

### 📈 Reports & Export
- Generate department-wise reports
- Generate section-wise reports
- Complete system reports
- Export reports to CSV
- Print-optimized layouts
- Custom report filtering

### 🛡️ Security Features
- Helmet.js for HTTP security headers
- Rate limiting (100 req/15min general, 5 req/15min auth)
- NoSQL injection prevention
- XSS protection
- CORS configuration
- Request size limits
- Secure password policies

### 👤 User Management (Admin Only)
- View all users
- Ban/unban users
- Delete users
- User statistics
- Role management

### ⚙️ Settings & Preferences
- Profile management
- Change password
- Theme preferences
- Notification settings
- Display preferences


## 🛠️ Technology Stack

### Frontend
- **React** 19.1.1 - UI library
- **Vite** 7.1.7 - Build tool and dev server
- **Tailwind CSS** 3.4.18 - Utility-first CSS framework
- **shadcn/ui** - High-quality React components
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **Lucide React** - Icon library

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** 4.18.2 - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** 8.1.1 - MongoDB ODM
- **JWT** - JSON Web Tokens for authentication
- **bcryptjs** - Password hashing
- **Helmet** - Security middleware
- **express-rate-limit** - Rate limiting
- **CORS** - Cross-origin resource sharing

### Development Tools
- **Git** - Version control
- **npm** - Package manager
- **VS Code** - Code editor
- **Postman** - API testing
- **ESLint** - Code linting

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **MongoDB** (v6 or higher) - [Download](https://www.mongodb.com/try/download/community)
- **npm** (comes with Node.js) or **yarn**
- **Git** - [Download](https://git-scm.com/)

### Verify Installation

```bash
node --version  # Should be v18 or higher
npm --version   # Should be v9 or higher
mongod --version # Should be v6 or higher
```


## 🚀 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/student-management-system.git
cd student-management-system
```

### 2. Install Backend Dependencies

```bash
cd server
npm install
```

### 3. Install Frontend Dependencies

```bash
cd ../client
npm install
```

### 4. Set Up MongoDB

**Option A: Local MongoDB**
```bash
# Start MongoDB service
# On macOS with Homebrew:
brew services start mongodb-community

# On Windows:
# Start MongoDB from Services or run:
mongod

# On Linux:
sudo systemctl start mongod
```

**Option B: MongoDB Atlas (Cloud)**
1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster
3. Get your connection string
4. Use it in the `.env` file


## ⚙️ Configuration

### Backend Configuration

1. Navigate to the server directory:
```bash
cd server
```

2. Create a `.env` file (copy from `.env.example`):
```bash
cp .env.example .env
```

3. Edit `.env` with your configuration:
```env
# Server Configuration
PORT=3000
NODE_ENV=development

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/student_management

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=7d

# CORS Configuration
CLIENT_URL=http://localhost:5173
```

### Frontend Configuration

1. Navigate to the client directory:
```bash
cd client
```

2. Create a `.env` file (copy from `.env.example`):
```bash
cp .env.example .env
```

3. Edit `.env` with your configuration:
```env
# API Configuration
VITE_API_URL=http://localhost:3000/api
```

### Important Security Notes

⚠️ **Never commit `.env` files to version control!**

- Change `JWT_SECRET` to a strong, random string in production
- Use environment-specific configurations
- Keep sensitive credentials secure


## 🏃 Running the Application

### Development Mode

#### Option 1: Run Both Servers Separately

**Terminal 1 - Backend:**
```bash
cd server
npm run dev
```
Backend will run on `http://localhost:3000`

**Terminal 2 - Frontend:**
```bash
cd client
npm run dev
```
Frontend will run on `http://localhost:5173`

#### Option 2: Using Concurrently (if configured)

From the root directory:
```bash
npm run dev
```

### Production Mode

**Build Frontend:**
```bash
cd client
npm run build
```

**Start Backend:**
```bash
cd server
npm start
```

### Initial Setup

#### 1. Create Admin User

```bash
cd server
node scripts/createAdmin.js
```

Default admin credentials:
- **Username:** admin
- **Password:** admin123

⚠️ **Change the default password immediately after first login!**

#### 2. Seed Test Data (Optional)

```bash
cd server
node scripts/seedData.js
```

This will create:
- 4 Departments (CS, EC, ME, CE)
- 8 Sections (A & B for each department)
- 80 Students (10 per section)
- 1 Faculty user


## 📁 Project Structure

```
student-management-system/
├── client/                      # Frontend React application
│   ├── public/                  # Static files
│   ├── src/
│   │   ├── components/          # React components
│   │   │   ├── ui/             # shadcn/ui components
│   │   │   ├── students/       # Student-related components
│   │   │   ├── departments/    # Department-related components
│   │   │   ├── settings/       # Settings components
│   │   │   ├── AppLayout.jsx   # Main layout component
│   │   │   ├── Sidebar.jsx     # Navigation sidebar
│   │   │   ├── ProtectedRoute.jsx
│   │   │   └── ErrorBoundary.jsx
│   │   ├── pages/              # Page components
│   │   │   ├── LoginPage.jsx
│   │   │   ├── SignupPage.jsx
│   │   │   ├── DashboardPage.jsx
│   │   │   ├── StudentsPage.jsx
│   │   │   ├── DepartmentsPage.jsx
│   │   │   ├── ReportsPage.jsx
│   │   │   ├── SettingsPage.jsx
│   │   │   └── UserManagementPage.jsx
│   │   ├── lib/                # Utility functions
│   │   │   ├── api.js          # API client
│   │   │   └── utils.js        # Helper functions
│   │   ├── App.jsx             # Main App component
│   │   ├── main.jsx            # Entry point
│   │   └── index.css           # Global styles
│   ├── .env.example            # Environment variables template
│   ├── package.json            # Dependencies
│   ├── vite.config.js          # Vite configuration
│   └── tailwind.config.js      # Tailwind configuration
│
├── server/                      # Backend Express application
│   ├── api/
│   │   └── index.js            # Main server file
│   ├── controllers/            # Request handlers
│   │   ├── authController.js
│   │   ├── studentController.js
│   │   ├── departmentController.js
│   │   ├── sectionController.js
│   │   ├── reportController.js
│   │   ├── dashboardController.js
│   │   ├── userController.js
│   │   └── profileController.js
│   ├── models/                 # Mongoose models
│   │   ├── User.js
│   │   ├── Student.js
│   │   ├── Department.js
│   │   └── Section.js
│   ├── routes/                 # API routes
│   │   ├── authRoutes.js
│   │   ├── studentRoutes.js
│   │   ├── departmentRoutes.js
│   │   ├── sectionRoutes.js
│   │   ├── reportRoutes.js
│   │   ├── dashboardRoutes.js
│   │   ├── userRoutes.js
│   │   └── profileRoutes.js
│   ├── middleware/             # Custom middleware
│   │   ├── authMiddleware.js   # JWT verification
│   │   └── errorHandler.js     # Error handling
│   ├── scripts/                # Utility scripts
│   │   ├── createAdmin.js      # Create admin user
│   │   └── seedData.js         # Seed test data
│   ├── .env.example            # Environment variables template
│   └── package.json            # Dependencies
│
├── .gitignore                  # Git ignore rules
├── README.md                   # This file
├── QUICKSTART.md              # Quick start guide
├── PROJECT_SUMMARY.md         # Project overview
└── REPORTS_DOCUMENTATION.md   # Reports guide
```


## 🔌 API Documentation

### Base URL
```
http://localhost:3000/api
```

### Authentication Endpoints

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/auth/signup` | User self-registration | Public |
| POST | `/auth/login` | User login | Public |
| POST | `/auth/logout` | User logout | Protected |
| POST | `/auth/register` | Admin creates user | Admin |
| GET | `/auth/verify` | Verify JWT token | Protected |

### Student Endpoints

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/students` | Get all students | Protected |
| GET | `/students/search` | Search students | Protected |
| GET | `/students/:id` | Get student by ID | Protected |
| POST | `/students` | Create student | Admin/Faculty |
| PUT | `/students/:id` | Update student | Admin |
| DELETE | `/students/:id` | Delete student | Admin |

### Department Endpoints

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/departments` | Get all departments | Protected |
| GET | `/departments/:id` | Get department by ID | Protected |
| GET | `/departments/:id/sections` | Get sections by dept | Protected |
| POST | `/departments` | Create department | Admin |
| PUT | `/departments/:id` | Update department | Admin |
| DELETE | `/departments/:id` | Delete department | Admin |

### Section Endpoints

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/sections` | Get all sections | Protected |
| POST | `/sections` | Create section | Admin |
| PUT | `/sections/:id` | Update section | Admin |
| DELETE | `/sections/:id` | Delete section | Admin |

### Report Endpoints

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/reports/department` | Department report | Protected |
| GET | `/reports/section` | Section report | Protected |
| GET | `/reports/complete` | Complete report | Protected |
| GET | `/reports/export/csv` | Export to CSV | Protected |

### Dashboard Endpoints

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/dashboard/stats` | Get statistics | Protected |

### User Management Endpoints

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/users` | Get all users | Admin |
| GET | `/users/stats` | Get user stats | Admin |
| GET | `/users/:id` | Get user by ID | Admin |
| POST | `/users/:id/ban` | Ban user | Admin |
| POST | `/users/:id/unban` | Unban user | Admin |
| DELETE | `/users/:id` | Delete user | Admin |

### Profile Endpoints

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/profile` | Get user profile | Protected |
| PUT | `/profile` | Update profile | Protected |
| GET | `/profile/preferences` | Get preferences | Protected |
| PUT | `/profile/preferences` | Update preferences | Protected |
| POST | `/profile/change-password` | Change password | Protected |

### Request/Response Examples

**Login Request:**
```json
POST /api/auth/login
{
  "username": "admin",
  "password": "admin123"
}
```

**Login Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "username": "admin",
    "email": "admin@example.com",
    "role": "Admin"
  }
}
```

**Create Student Request:**
```json
POST /api/students
Authorization: Bearer <token>
{
  "name": "John Doe",
  "rollNumber": "CS2024001",
  "department": "507f1f77bcf86cd799439011",
  "section": "507f1f77bcf86cd799439012",
  "email": "john.doe@example.com",
  "contact": "1234567890"
}
```


## 👥 User Roles

### Admin
**Full system access with all privileges:**

- ✅ Manage students (Create, Read, Update, Delete)
- ✅ Manage departments (Create, Read, Update, Delete)
- ✅ Manage sections (Create, Read, Update, Delete)
- ✅ Manage users (View, Ban, Unban, Delete)
- ✅ Generate and export reports
- ✅ View dashboard statistics
- ✅ Access all system features

### Faculty
**Limited access for teaching staff:**

- ✅ View all students
- ✅ Create new students
- ✅ Search and filter students
- ✅ View departments and sections
- ✅ Generate and export reports
- ✅ View dashboard statistics
- ❌ Cannot update or delete students
- ❌ Cannot manage departments/sections
- ❌ Cannot manage users

### Default Credentials

After running `createAdmin.js`:

**Admin Account:**
```
Username: admin
Password: admin123
```

After running `seedData.js`:

**Faculty Account:**
```
Username: faculty
Password: faculty123
```

⚠️ **Important:** Change default passwords immediately in production!


## 📸 Screenshots

### Login Page
User authentication with secure login form.

### Dashboard
Role-based dashboard showing system statistics and quick actions.

**Admin Dashboard:**
- Total students, departments, sections
- Department-wise distribution
- Quick action buttons
- Recent activity

**Faculty Dashboard:**
- Student statistics
- Department overview
- Quick access to student management

### Student Management
Comprehensive student management interface with:
- Search and filter capabilities
- Add/Edit/Delete operations
- Detailed student view
- Pagination

### Department & Section Management
Organized accordion-based interface for:
- Department CRUD operations
- Section management under departments
- Capacity tracking
- Student count per section

### Reports
Advanced reporting system with:
- Department-wise reports
- Section-wise reports
- Complete system reports
- CSV export functionality
- Print-optimized layouts

### Settings
User profile and preferences management:
- Profile information
- Password change
- Theme preferences
- Notification settings


## 🧪 Testing

### Manual Testing

1. **Start the application** (both frontend and backend)

2. **Test Authentication:**
   - Navigate to `http://localhost:5173/login`
   - Login with admin credentials
   - Verify dashboard loads correctly
   - Test logout functionality

3. **Test Student Management:**
   - Add a new student
   - Search for students
   - Filter by department/section
   - Edit student details
   - Delete a student (Admin only)

4. **Test Department Management:**
   - Create a new department
   - Add sections to department
   - Edit department/section
   - Delete department/section

5. **Test Reports:**
   - Generate department report
   - Generate section report
   - Export to CSV
   - Test print functionality

### API Testing with Postman

1. Import the API collection (if available)
2. Set environment variables:
   - `base_url`: `http://localhost:3000/api`
   - `token`: Your JWT token after login

3. Test each endpoint:
   - Authentication endpoints
   - CRUD operations
   - Report generation
   - Error handling

### Test Data

Use the seed script to populate test data:
```bash
cd server
node scripts/seedData.js
```

This creates:
- 4 Departments
- 8 Sections
- 80 Students
- 2 Users (Admin + Faculty)


## 🚀 Deployment

### Deploying to Vercel

#### Frontend Deployment

1. **Install Vercel CLI:**
```bash
npm install -g vercel
```

2. **Deploy Frontend:**
```bash
cd client
vercel
```

3. **Set Environment Variables in Vercel:**
   - Go to Vercel Dashboard → Your Project → Settings → Environment Variables
   - Add: `VITE_API_URL` = Your backend URL

#### Backend Deployment

1. **Deploy Backend:**
```bash
cd server
vercel
```

2. **Set Environment Variables in Vercel:**
   - `MONGODB_URI` = Your MongoDB connection string
   - `JWT_SECRET` = Your JWT secret key
   - `CLIENT_URL` = Your frontend URL
   - `NODE_ENV` = production

### Deploying to Other Platforms

#### Heroku

**Backend:**
```bash
cd server
heroku create your-app-name
heroku config:set MONGODB_URI=your_mongodb_uri
heroku config:set JWT_SECRET=your_jwt_secret
git push heroku main
```

**Frontend:**
```bash
cd client
# Build the app
npm run build
# Deploy the dist folder
```

#### Railway

1. Connect your GitHub repository
2. Select the server folder
3. Add environment variables
4. Deploy

#### MongoDB Atlas

1. Create a free cluster at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a database user
3. Whitelist IP addresses (0.0.0.0/0 for all)
4. Get connection string
5. Update `MONGODB_URI` in your environment variables

### Production Checklist

- [ ] Change default admin password
- [ ] Update JWT_SECRET to a strong random string
- [ ] Set NODE_ENV to 'production'
- [ ] Configure CORS for your domain
- [ ] Set up MongoDB Atlas or production database
- [ ] Enable HTTPS/SSL
- [ ] Set up error logging (e.g., Sentry)
- [ ] Configure rate limiting
- [ ] Set up database backups
- [ ] Test all features in production
- [ ] Monitor application performance


## 🔧 Troubleshooting

### Common Issues

#### MongoDB Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```
**Solution:**
- Ensure MongoDB is running: `mongod` or `brew services start mongodb-community`
- Check MongoDB URI in `.env` file
- Verify MongoDB is installed correctly

#### Port Already in Use
```
Error: listen EADDRINUSE: address already in use :::3000
```
**Solution:**
- Kill the process using the port:
  ```bash
  # On macOS/Linux
  lsof -ti:3000 | xargs kill -9
  
  # On Windows
  netstat -ano | findstr :3000
  taskkill /PID <PID> /F
  ```
- Or change the port in `.env` file

#### CORS Error
```
Access to XMLHttpRequest has been blocked by CORS policy
```
**Solution:**
- Verify `CLIENT_URL` in server `.env` matches your frontend URL
- Check CORS configuration in `server/api/index.js`
- Ensure credentials are included in API requests

#### JWT Token Invalid
```
Error: jwt malformed or invalid token
```
**Solution:**
- Clear browser localStorage
- Login again to get a new token
- Verify JWT_SECRET is the same in `.env`

#### Module Not Found
```
Error: Cannot find module 'express'
```
**Solution:**
- Run `npm install` in the respective directory
- Delete `node_modules` and `package-lock.json`, then run `npm install` again

### Getting Help

If you encounter issues:

1. Check the [Issues](https://github.com/yourusername/student-management-system/issues) page
2. Review the documentation files:
   - `QUICKSTART.md` - Quick start guide
   - `PROJECT_SUMMARY.md` - Project overview
   - `REPORTS_DOCUMENTATION.md` - Reports guide
3. Check server logs for error messages
4. Verify all environment variables are set correctly


## 🤝 Contributing

Contributions are welcome! Here's how you can help:

### How to Contribute

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/AmazingFeature
   ```
3. **Commit your changes**
   ```bash
   git commit -m 'Add some AmazingFeature'
   ```
4. **Push to the branch**
   ```bash
   git push origin feature/AmazingFeature
   ```
5. **Open a Pull Request**

### Contribution Guidelines

- Follow the existing code style
- Write clear commit messages
- Add comments for complex logic
- Update documentation if needed
- Test your changes thoroughly
- Ensure no breaking changes

### Code Style

- Use ES6+ features
- Follow React best practices
- Use meaningful variable names
- Keep functions small and focused
- Add JSDoc comments for functions

### Reporting Bugs

If you find a bug, please create an issue with:
- Clear description of the bug
- Steps to reproduce
- Expected behavior
- Actual behavior
- Screenshots (if applicable)
- Environment details (OS, Node version, etc.)

### Feature Requests

For feature requests, create an issue with:
- Clear description of the feature
- Use case and benefits
- Possible implementation approach


## 📚 Additional Documentation

- **[QUICKSTART.md](QUICKSTART.md)** - Quick start guide for getting up and running
- **[PROJECT_SUMMARY.md](PROJECT_SUMMARY.md)** - Comprehensive project overview
- **[REPORTS_DOCUMENTATION.md](REPORTS_DOCUMENTATION.md)** - Detailed reports system guide
- **[PROJECT_COMPLETION_ANALYSIS.md](PROJECT_COMPLETION_ANALYSIS.md)** - Project completion status
- **[COMPLETION_REPORT.md](COMPLETION_REPORT.md)** - Detailed completion report

## 🔮 Future Enhancements

Planned features for future versions:

### Phase 1: Advanced Features
- [ ] Advanced search with multiple filters
- [ ] Bulk import/export (Excel, CSV)
- [ ] Student photo upload
- [ ] Email notifications
- [ ] In-app notifications

### Phase 2: Enhanced Security
- [ ] Two-factor authentication (2FA)
- [ ] Session management
- [ ] Audit logging
- [ ] Enhanced password policies
- [ ] IP whitelisting

### Phase 3: Extended Functionality
- [ ] Attendance management system
- [ ] Marks/grades management
- [ ] Fee management
- [ ] Timetable management
- [ ] Parent portal
- [ ] Course management
- [ ] Assignment submission

### Phase 4: Analytics & Reporting
- [ ] Advanced analytics dashboard
- [ ] Data visualization charts
- [ ] Predictive analytics
- [ ] Custom report builder
- [ ] Automated report scheduling

### Phase 5: User Experience
- [ ] Multi-language support
- [ ] Dark mode
- [ ] Mobile app (React Native)
- [ ] Progressive Web App (PWA)
- [ ] Offline mode


## 📄 License

This project is licensed under the MIT License - see below for details:

```
MIT License

Copyright (c) 2025 Student Management System

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

## 👨‍💻 Authors

- **Your Name** - *Initial work* - [YourGitHub](https://github.com/yourusername)

## 🙏 Acknowledgments

- [React](https://reactjs.org/) - Frontend library
- [Express.js](https://expressjs.com/) - Backend framework
- [MongoDB](https://www.mongodb.com/) - Database
- [shadcn/ui](https://ui.shadcn.com/) - UI components
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [Lucide](https://lucide.dev/) - Icon library

## 📞 Support

For support and questions:

- 📧 Email: your.email@example.com
- 🐛 Issues: [GitHub Issues](https://github.com/yourusername/student-management-system/issues)
- 💬 Discussions: [GitHub Discussions](https://github.com/yourusername/student-management-system/discussions)

## 🌟 Show Your Support

If you find this project helpful, please give it a ⭐️!

---

**Built with ❤️ using the MERN Stack**

*Last Updated: January 2025*
