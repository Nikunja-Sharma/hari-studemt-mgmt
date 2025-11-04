import express from 'express';
import { 
    getAllUsers, 
    getUserById, 
    banUser, 
    unbanUser, 
    deleteUser,
    getUserStats 
} from '../controllers/userController.js';
import { verifyToken, checkRole } from '../middleware/authMiddleware.js';

const router = express.Router();

// All routes require authentication and Admin role
router.use(verifyToken);
router.use(checkRole('Admin'));

// Get user statistics
router.get('/stats', getUserStats);

// Get all users with filtering and pagination
router.get('/', getAllUsers);

// Get user by ID
router.get('/:id', getUserById);

// Ban user
router.post('/:id/ban', banUser);

// Unban user
router.post('/:id/unban', unbanUser);

// Delete user
router.delete('/:id', deleteUser);

export default router;
