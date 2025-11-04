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

