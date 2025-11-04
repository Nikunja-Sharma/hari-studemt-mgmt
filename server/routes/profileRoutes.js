import express from 'express';
import {
    getProfile,
    updateProfile,
    getPreferences,
    updatePreferences,
    changePassword,
    uploadAvatar
} from '../controllers/profileController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// All routes require authentication
router.use(verifyToken);

// Profile routes
router.get('/', getProfile);
router.put('/', updateProfile);

// Preferences routes
router.get('/preferences', getPreferences);
router.put('/preferences', updatePreferences);

// Password change route
router.post('/change-password', changePassword);

// Avatar upload route
router.post('/upload-avatar', uploadAvatar);

export default router;
