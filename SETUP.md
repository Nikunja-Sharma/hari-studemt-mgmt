# Student Management System - Setup Guide

## Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

## Installation

### 1. Clone the repository and install dependencies

```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### 2. Environment Configuration

Create a `.env` file in the `server` directory:

```env
# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/student_management_db

# JWT Secret (use a strong random string in production)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Server Port
PORT=3000

# Client URL (for CORS)
CLIENT_URL=http://localhost:5173

# Node Environment
NODE_ENV=development
```

### 3. Start MongoDB

Make sure MongoDB is running on your system:

```bash
# If using local MongoDB
mongod

# Or use MongoDB Atlas connection string in .env
```

## Running the Application

### Development Mode

You need to run both the server and client in separate terminals:

**Terminal 1 - Start the backend server:**
```bash
cd server
npm run dev
```
Server will run on http://localhost:3000

**Terminal 2 - Start the frontend client:**
```bash
cd client
npm run dev
```
Client will run on http://localhost:5173

## Authentication

The system uses HTTP-only cookies for secure authentication.

### Creating the First Admin User

You'll need to create an admin user directly in MongoDB or modify the register route temporarily to allow public registration.

**Option 1: Using MongoDB Shell**
```javascript
use student_management_db

db.users.insertOne({
  username: "admin",
  email: "admin@example.com",
  password: "$2a$10$YourHashedPasswordHere", // Use bcrypt to hash
  role: "Admin",
  createdAt: new Date(),
  updatedAt: new Date()
})
```

**Option 2: Temporarily modify the register route**
1. Comment out the authentication middleware in `server/routes/authRoutes.js`
2. Register via POST to `/api/auth/register`
3. Re-enable the middleware

### Default Login Credentials

After creating an admin user, you can log in at http://localhost:5173/login

## API Endpoints

### Authentication
- `POST /api/auth/login` - Login (public)
- `POST /api/auth/logout` - Logout (protected)
- `POST /api/auth/register` - Register new user (Admin only)
- `GET /api/auth/verify` - Verify token (protected)

### Students
- `GET /api/students` - Get all students (protected)
- `GET /api/students/:id` - Get student by ID (protected)
- `POST /api/students` - Create student (Admin/Faculty)
- `PUT /api/students/:id` - Update student (Admin)
- `DELETE /api/students/:id` - Delete student (Admin)
- `GET /api/students/search?q=query` - Search students (protected)

### Departments
- `GET /api/departments` - Get all departments (protected)
- `GET /api/departments/:id` - Get department by ID (protected)
- `POST /api/departments` - Create department (Admin only)
- `PUT /api/departments/:id` - Update department (Admin only)
- `DELETE /api/departments/:id` - Delete department (Admin only)
- `GET /api/departments/:id/sections` - Get sections by department (protected)

### Sections
- `GET /api/sections` - Get all sections (protected)
- `POST /api/sections` - Create section (Admin only)
- `PUT /api/sections/:id` - Update section (Admin only)
- `DELETE /api/sections/:id` - Delete section (Admin only)

### Dashboard
- `GET /api/dashboard/stats` - Get dashboard statistics (protected)

### Reports
- `GET /api/reports/department` - Generate department report (protected)
- `GET /api/reports/section` - Generate section report (protected)
- `GET /api/reports/complete` - Generate complete report (protected)
- `GET /api/reports/export/csv` - Export report to CSV (protected)

## Security Features

- **HTTP-only Cookies**: JWT tokens stored in secure HTTP-only cookies
- **CORS Protection**: Configured for specific origins
- **Role-based Access Control**: Admin and Faculty roles with different permissions
- **Password Hashing**: bcrypt for secure password storage
- **Input Validation**: express-validator for request validation
- **Error Handling**: Centralized error handling middleware

## Tech Stack

### Frontend
- React 19.1.1
- Vite 7.1.7
- React Router DOM
- Tailwind CSS 3.4.18
- shadcn/ui components
- Lucide React (icons)

### Backend
- Node.js with Express.js 4.18.2
- MongoDB with Mongoose 8.1.1
- JWT Authentication
- bcryptjs for password hashing
- cookie-parser for cookie handling
- express-validator for validation

## Troubleshooting

### CORS Issues
Make sure the `CLIENT_URL` in your `.env` matches your frontend URL.

### Cookie Not Being Set
Ensure you're accessing the app via the same domain/port configured in CORS settings.

### MongoDB Connection Error
Check that MongoDB is running and the connection string in `.env` is correct.

### Port Already in Use
Change the `PORT` in `.env` or kill the process using the port.

## Production Deployment

For production deployment:

1. Set `NODE_ENV=production` in environment variables
2. Use a strong `JWT_SECRET`
3. Configure MongoDB Atlas or production database
4. Set up proper CORS origins
5. Enable HTTPS for secure cookies
6. Configure proper environment variables in your hosting platform

## License

This project is for educational purposes.
