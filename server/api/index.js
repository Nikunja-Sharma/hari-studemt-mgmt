import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import mongoSanitize from 'express-mongo-sanitize';
import path from 'path';
import { fileURLToPath } from 'url';
import authRoutes from '../routes/authRoutes.js';
import studentRoutes from '../routes/studentRoutes.js';
import departmentRoutes from '../routes/departmentRoutes.js';
import sectionRoutes from '../routes/sectionRoutes.js';
import dashboardRoutes from '../routes/dashboardRoutes.js';
import reportRoutes from '../routes/reportRoutes.js';
import profileRoutes from '../routes/profileRoutes.js';
import userRoutes from '../routes/userRoutes.js';
import { errorHandler, notFoundHandler } from '../middleware/errorHandler.js';

dotenv.config();

const app = express();

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Security Middleware
// Helmet helps secure Express apps by setting various HTTP headers
app.use(helmet({
    contentSecurityPolicy: false, // Disable for development, enable in production
    crossOriginEmbedderPolicy: false
}));

// CORS configuration for cookies
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173', // Vite default port
    credentials: true
}));

// Rate limiting to prevent brute force attacks
// const limiter = rateLimit({
//     windowMs: 15 * 60 * 1000, // 15 minutes
//     max: 100, // Limit each IP to 100 requests per windowMs
//     message: 'Too many requests from this IP, please try again later.',
//     standardHeaders: true,
//     legacyHeaders: false,
// });

// Apply rate limiting to all routes
// app.use(limiter);

// Stricter rate limiting for authentication routes
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // Limit each IP to 5 login requests per windowMs
    message: 'Too many login attempts, please try again later.',
    skipSuccessfulRequests: true
});

// Middleware
app.use(cookieParser());

// Body parser with size limits
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

// Data sanitization against NoSQL injection
app.use(mongoSanitize());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/auth_db')
	.then(() => console.log('Connected to MongoDB'))
	.catch((err) => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/departments', departmentRoutes);
app.use('/api/sections', sectionRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/users/profile', profileRoutes);
app.use('/api/admin/users', userRoutes);

// Dummy data to store users
let users = [
	{ id: "1", name: "John Doe", email: "john@example.com" },
	{ id: "2", name: "Jane Smith", email: "jane@example.com" },
	{ id: "3", name: "Bob Wilson", email: "bob@example.com" }
];

app.use(express.static('public'));

app.get('/', function (req, res) {
	res.sendFile(path.join(__dirname, '..', 'components', 'home.htm'));
});

app.get('/about', function (req, res) {
	res.sendFile(path.join(__dirname, '..', 'components', 'about.htm'));
});

app.get('/uploadUser', function (req, res) {
	res.sendFile(path.join(__dirname, '..', 'components', 'user_upload_form.htm'));
});

app.post('/uploadSuccessful', bodyParser.urlencoded({ extended: false }), (req, res) => {
	try {
		const newUser = {
			id: req.body.user_id,
			name: req.body.name,
			email: req.body.email
		};
		users.push(newUser);
		res.status(200).send('<h1>User added successfully</h1>');
	} catch (error) {
		console.error(error);
		res.status(500).send('Error adding user');
	}
});

app.get('/allUsers', (req, res) => {
	try {
		if (users.length > 0) {
			let tableContent = users
				.map(
					(user) =>
						`<tr>
                        <td>${user.id}</td>
                        <td>${user.name}</td>
                        <td>${user.email}</td>
                    </tr>`
				)
				.join('');

			res.status(200).send(`
                <html>
                    <head>
                        <title>Users</title>
                        <style>
                            body {
                                font-family: Arial, sans-serif;
                            }
                            table {
                                width: 100%;
                                border-collapse: collapse;
                                margin-bottom: 15px;
                            }
                            th, td {
                                border: 1px solid #ddd;
                                padding: 8px;
                                text-align: left;
                            }
                            th {
                                background-color: #f2f2f2;
                            }
                            a {
                                text-decoration: none;
                                color: #0a16f7;
                                margin: 15px;
                            }
                        </style>
                    </head>
                    <body>
                        <h1>Users</h1>
                        <table>
                            <thead>
                                <tr>
                                    <th>User ID</th>
                                    <th>Name</th>
                                    <th>Email</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${tableContent}
                            </tbody>
                        </table>
                        <div>
                            <a href="/">Home</a>
                            <a href="/uploadUser">Add User</a>
                        </div>
                    </body>
                </html>
            `);
		} else {
			res.status(404).send('Users not found');
		}
	} catch (error) {
		console.error(error);
		res.status(500).send('Error retrieving users');
	}
});

// Error handling middleware (must be after all routes)
app.use(notFoundHandler);
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

export default app;
