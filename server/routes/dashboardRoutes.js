import express from 'express';
import { getStats } from '../controllers/dashboardController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// GET /api/dashboard/stats - Get dashboard statistics (authenticated users)
router.get('/stats', verifyToken, getStats);

export default router;
