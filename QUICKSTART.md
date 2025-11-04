# Quick Start Guide

Get the Student Management System up and running in 5 minutes!

## Step 1: Install Dependencies

```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

## Step 2: Configure Environment

```bash
# In the server directory, copy the example env file
cd server
cp .env.example .env

# Edit .env and update if needed (default values work for local development)
```

## Step 3: Start MongoDB

Make sure MongoDB is running:

```bash
# If using local MongoDB
mongod

# Or use MongoDB Atlas - just update MONGODB_URI in .env
```

## Step 4: Create Admin User

```bash
# In the server directory
cd server
npm run create-admin
```

This will create an admin user with:
- **Email**: admin@example.com
- **Password**: Admin@123

## Step 5: Start the Application

Open **two terminal windows**:

**Terminal 1 - Backend:**
```bash
cd server
npm run dev
```
✅ Server running on http://localhost:3000

**Terminal 2 - Frontend:**
```bash
cd client
npm run dev
```
✅ Client running on http://localhost:5173

## Step 6: Login or Sign Up

1. Open your browser to http://localhost:5173
2. You'll be redirected to the login page

**Option 1: Login with Admin Account**
- Email: `admin@example.com`
- Password: `Admin@123`

**Option 2: Create a New Account**
- Click "Sign up" on the login page
- Fill in your details (username, email, password)
- Choose your role (Faculty or Admin)
- After registration, login with your credentials

## What's Next?

After logging in, you'll see the dashboard. From there you can:

- ✅ View system statistics
- ✅ Navigate to different sections (Students, Departments, Reports)
- ✅ Create new users (Admin only)
- ✅ Manage students, departments, and sections

## Troubleshooting

### "Cannot connect to MongoDB"
- Make sure MongoDB is running
- Check the MONGODB_URI in your .env file

### "Port 3000 already in use"
- Change the PORT in server/.env
- Or kill the process: `lsof -ti:3000 | xargs kill`

### "Port 5173 already in use"
- Vite will automatically try the next available port
- Or specify a different port in client/vite.config.js

### Cookies not working
- Make sure you're accessing via http://localhost:5173 (not 127.0.0.1)
- Check that CLIENT_URL in .env matches your frontend URL

## Features Implemented

✅ **Authentication System**
- HTTP-only cookie-based JWT authentication
- Login/Logout functionality
- Protected routes with role-based access

✅ **Backend APIs**
- Student management (CRUD)
- Department management (CRUD)
- Section management (CRUD)
- Dashboard statistics
- Report generation (Department, Section, Complete)
- CSV export

✅ **Frontend Components**
- Login page
- Dashboard with statistics
- App layout with navigation
- Protected routes
- Responsive design with Tailwind CSS
- shadcn/ui components

✅ **Security**
- HTTP-only cookies
- Password hashing with bcrypt
- JWT token authentication
- Role-based access control (Admin/Faculty)
- Input validation
- CORS protection

## Need Help?

Check the full [SETUP.md](./SETUP.md) for detailed documentation.
