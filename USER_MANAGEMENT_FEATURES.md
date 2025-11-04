# User Management Features

## Overview
Added comprehensive user management features to the admin panel, allowing administrators to view, manage, ban, and delete faculty accounts.

## Backend Changes

### 1. User Model Updates (`server/models/User.js`)
- Added `isBanned` field (boolean, default: false)
- Added `bannedAt` field (Date)
- Added `bannedBy` field (reference to User who banned)
- Added `banReason` field (string)

### 2. New User Controller (`server/controllers/userController.js`)
Created comprehensive user management endpoints:
- `getAllUsers` - List all users with filtering, search, and pagination
- `getUserById` - Get detailed user information
- `banUser` - Ban a user account (prevents login)
- `unbanUser` - Unban a previously banned user
- `deleteUser` - Permanently delete a user account
- `getUserStats` - Get user statistics (total, faculty, admins, banned, active)

### 3. New User Routes (`server/routes/userRoutes.js`)
Admin-only routes:
- `GET /api/admin/users` - List users with filters
- `GET /api/admin/users/stats` - Get user statistics
- `GET /api/admin/users/:id` - Get user by ID
- `POST /api/admin/users/:id/ban` - Ban user
- `POST /api/admin/users/:id/unban` - Unban user
- `DELETE /api/admin/users/:id` - Delete user

### 4. Auth Controller Updates (`server/controllers/authController.js`)
- Added ban check during login
- Returns appropriate error message if account is banned

### 5. Server Configuration (`server/api/index.js`)
- Added user management routes at `/api/admin/users`
- Fixed profile routes to avoid conflicts (`/api/users/profile`)

### 6. Dashboard Controller Updates (`server/controllers/dashboardController.js`)
- Added `totalUsers` and `totalFaculty` to dashboard statistics

## Frontend Changes

### 1. New User Management Page (`client/src/pages/UserManagementPage.jsx`)
Comprehensive admin interface featuring:
- **Statistics Cards**: Total users, faculty, active, and banned counts
- **Search & Filters**: Search by username/email, filter by role
- **User Table**: Displays all users with:
  - Username and email
  - Role badge (Admin/Faculty)
  - Status badge (Active/Banned)
  - Join date and last login
  - Action buttons (Ban/Unban, Delete)
- **Ban Dialog**: Modal to ban users with optional reason
- **Delete Dialog**: Confirmation modal for user deletion
- **Pagination**: Navigate through large user lists

### 2. API Library Updates (`client/src/lib/api.js`)
- Fixed profile API paths
- Added `adminUserAPI` with methods:
  - `getAll(params)` - List users
  - `getById(id)` - Get user details
  - `getStats()` - Get statistics
  - `banUser(id, reason)` - Ban user
  - `unbanUser(id)` - Unban user
  - `deleteUser(id)` - Delete user

### 3. App Routing (`client/src/App.jsx`)
- Added `/users` route for UserManagementPage

### 4. Sidebar Updates (`client/src/components/Sidebar.jsx`)
- Added "Users" menu item (visible only to admins)

### 5. Admin Dashboard Updates (`client/src/pages/AdminDashboard.jsx`)
- Added "Total Faculty" statistics card
- Updated "Manage Users" button to navigate to `/users`
- Changed grid layout to accommodate 4 cards

## Features

### User Listing
- View all users in a paginated table
- Search by username, email, first name, or last name
- Filter by role (Admin/Faculty)
- See user status (Active/Banned)
- View join date and last login

### Ban Management
- Ban users with optional reason
- Banned users cannot log in
- Unban users to restore access
- View ban reason and date
- Admins cannot ban themselves

### User Deletion
- Permanently delete user accounts
- Confirmation dialog to prevent accidents
- Admins cannot delete themselves

### Statistics
- Total users count
- Faculty count
- Active users count
- Banned users count
- Recent users (last 7 days)

### Security
- All endpoints require admin authentication
- Self-protection (cannot ban/delete yourself)
- Ban check during login
- Proper error messages

## Usage

### For Administrators

1. **Access User Management**
   - Navigate to "Users" in the sidebar
   - Or click "Manage Users" from the admin dashboard

2. **View Users**
   - See all users in the table
   - Use search to find specific users
   - Filter by role to see only Admins or Faculty

3. **Ban a User**
   - Click "Ban" button next to the user
   - Optionally provide a reason
   - Confirm the action
   - User will be unable to log in

4. **Unban a User**
   - Click "Unban" button next to a banned user
   - User can log in again

5. **Delete a User**
   - Click the trash icon next to the user
   - Confirm the deletion
   - User account is permanently removed

## API Endpoints

### User Management
```
GET    /api/admin/users              - List users (with filters)
GET    /api/admin/users/stats        - Get user statistics
GET    /api/admin/users/:id          - Get user by ID
POST   /api/admin/users/:id/ban      - Ban user
POST   /api/admin/users/:id/unban    - Unban user
DELETE /api/admin/users/:id          - Delete user
```

### Query Parameters for Listing
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10)
- `role` - Filter by role (Admin/Faculty)
- `search` - Search term for username/email/name

## Notes

- All user management features are admin-only
- Admins cannot ban or delete themselves
- Banned users receive a clear error message when trying to log in
- User statistics are displayed on both the dashboard and user management page
- The system prevents duplicate usernames and emails
