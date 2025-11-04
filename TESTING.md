# Testing Guide

## Test Accounts

The system comes with pre-configured test accounts for development:

### Admin Account
- **Email:** `admin@example.com`
- **Password:** `Admin@123`
- **Access:** Full system access with CRUD operations

### Faculty Account
- **Email:** `faculty@example.com`
- **Password:** `Faculty@123`
- **Access:** Read-only access to student records

## Quick Test Features (Development Only)

### Login Page
When running in development mode (`npm run dev`), you'll see two quick login buttons:
- **Admin Login** - Auto-fills admin credentials
- **Faculty Login** - Auto-fills faculty credentials

Simply click the button and then click "Sign In" to test different roles.

### Signup Page
When running in development mode, you'll see a "Fill Test Data" button that:
- Generates a unique username and email with timestamp
- Pre-fills password fields with `Test@123`
- Sets role to Faculty by default

## Creating Test Accounts

To create the test accounts, run:

```bash
cd server
node scripts/createTestUsers.js
```

This will create both Admin and Faculty test accounts if they don't already exist.

## Production Behavior

In production builds:
- Test login buttons are automatically hidden
- `import.meta.env.DEV` returns `false`
- Users must enter credentials manually
- All security features remain active

## Environment Detection

The app uses Vite's built-in `import.meta.env.DEV` which:
- Returns `true` when running `npm run dev`
- Returns `false` when running production builds
- No additional configuration needed
- Automatically handles dev/prod differences

## Role-Based Dashboards

After login, users are automatically routed to their role-specific dashboard:

### Admin Dashboard
- Blue theme with "Administrator" badge
- Full CRUD operations
- User management
- System settings access

### Faculty Dashboard
- Green theme with "Faculty Member" badge
- Read-only student access
- Report viewing
- Search functionality
