# Appendices

## Appendix A: System Architecture Diagram

This appendix provides a visual representation of the Student Management System's three-tier architecture:

**Architecture Components:**
- **Frontend Layer**: React 19.1.1 with Vite build system
- **Backend Layer**: Express.js 4.18.2 REST API server
- **Database Layer**: MongoDB with Mongoose ODM

**Key Features:**
- JWT-based authentication flow
- RESTful API endpoints for CRUD operations
- Role-based access control (Admin/Faculty)
- Responsive web interface with Tailwind CSS

## Appendix B: System Requirements Specifications

### B.1 Hardware Requirements

| Component | Specification |
|-----------|--------------|
| Processor | Modern multi-core processor (Intel/AMD) |
| RAM | 4 GB minimum, 8 GB recommended |
| Storage | 10 GB available disk space |
| Network | Stable internet connection for MongoDB Atlas |

### B.2 Software Requirements

| Component | Specification |
|-----------|--------------|
| Operating System | Windows, macOS, or Linux |
| Runtime | Node.js 18.x or higher |
| Database | MongoDB 6.0+ (local or Atlas) |
| Code Editor | Visual Studio Code (recommended) |
| Browser | Modern browser (Chrome, Firefox, Safari, Edge) |

## Appendix C: API Endpoints Documentation

### C.1 Authentication Routes (`/api/auth`)

```
POST /api/auth/register    - User registration
POST /api/auth/login       - User authentication
GET  /api/auth/me          - Get current user profile
```

### C.2 Student Management Routes (`/api/students`)

```
GET    /api/students           - List all students
POST   /api/students           - Create new student
GET    /api/students/:id       - Get student details
PUT    /api/students/:id       - Update student
DELETE /api/students/:id       - Delete student
GET    /api/students/department/:dept - Filter by department
```

### C.3 Department Routes (`/api/departments`)

```
GET    /api/departments        - List all departments
POST   /api/departments        - Create department
PUT    /api/departments/:id    - Update department
DELETE /api/departments/:id    - Delete department
```

### C.4 Report Routes (`/api/reports`)

```
GET /api/reports/students      - Student statistics report
GET /api/reports/departments   - Department distribution report
GET /api/reports/export        - Export data (CSV/PDF)
```

## Appendix D: Database Schema Specifications

### D.1 User Schema

```javascript
{
  name: String (required),
  email: String (required, unique),
  password: String (required, hashed),
  role: String (enum: ['admin', 'faculty']),
  createdAt: Date,
  updatedAt: Date
}
```

### D.2 Student Schema

```javascript
{
  studentId: String (required, unique),
  name: String (required),
  email: String (required),
  phone: String,
  department: ObjectId (ref: 'Department'),
  section: ObjectId (ref: 'Section'),
  enrollmentDate: Date,
  status: String (enum: ['active', 'inactive']),
  createdAt: Date,
  updatedAt: Date
}
```

### D.3 Department Schema

```javascript
{
  name: String (required, unique),
  code: String (required, unique),
  description: String,
  head: String,
  createdAt: Date,
  updatedAt: Date
}
```

### D.4 Section Schema

```javascript
{
  name: String (required),
  department: ObjectId (ref: 'Department'),
  capacity: Number,
  currentStrength: Number,
  createdAt: Date,
  updatedAt: Date
}
```

## Appendix E: User Interface Screenshots

### E.1 Login Page
The authentication interface where users enter credentials to access the system.

### E.2 Signup Page
Registration form for creating new user accounts with role selection.

### E.3 Dashboard Page
Main landing page displaying system statistics and quick access cards for key features.

### E.4 Students Management Page
Comprehensive interface for viewing, adding, editing, and deleting student records with search and filter capabilities.

### E.5 Departments Page
Department management interface showing all departments with CRUD operations.

### E.6 Reports Page
Analytics dashboard displaying student statistics, department distribution, and data export options.

### E.7 Settings Page
User profile management, security settings, and system preferences configuration.

## Appendix F: Environment Configuration

### F.1 Backend Environment Variables (`.env`)

```
MONGODB_URI=mongodb://localhost:27017/student-management
JWT_SECRET=your_secure_jwt_secret_key
PORT=3000
NODE_ENV=development
```

### F.2 Frontend Environment Variables (`.env`)

```
VITE_API_URL=http://localhost:3000/api
```

## Appendix G: Deployment Configuration

### G.1 Vercel Deployment (Frontend)

Configuration file: `client/vercel.json`
- Build command: `npm run build`
- Output directory: `dist`
- Framework: Vite

### G.2 Vercel Deployment (Backend)

Configuration file: `server/vercel.json`
- Serverless function entry: `api/index.js`
- Environment variables configured in Vercel dashboard

## Appendix H: Security Implementation

### H.1 Authentication Flow
1. User submits credentials
2. Server validates and generates JWT token
3. Token stored in localStorage
4. Token included in Authorization header for protected routes
5. Middleware validates token on each request

### H.2 Password Security
- Passwords hashed using bcryptjs with salt rounds
- Plain text passwords never stored
- JWT tokens expire after configured duration

### H.3 Role-Based Access Control
- Admin: Full system access
- Faculty: Limited access to student records 