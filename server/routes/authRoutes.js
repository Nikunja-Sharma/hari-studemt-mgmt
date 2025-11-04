import express from 'express';
import { register, login, logout, signup } from '../controllers/authController.js';
import { verifyToken, checkRole } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public signup route (self-registration)
router.post('/signup', signup);

// Register route (Admin only - for creating users with any role)
router.post('/register', verifyToken, checkRole('Admin'), register);

// Login route (public)
router.post('/login', login);

// Logout route (protected)
router.post('/logout', verifyToken, logout);

// Verify token route (protected)
router.get('/verify', verifyToken, (req, res) => {
    // If verifyToken middleware passes, token is valid
    res.json({
        success: true,
        message: 'Token is valid',
        user: {
            id: req.user._id,
            username: req.user.username,
            email: req.user.email,
            role: req.user.role
        }
    });
});

export default router; 