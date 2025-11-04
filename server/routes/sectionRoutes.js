import express from 'express';
import {
    getAllSections,
    createSection,
    updateSection,
    deleteSection
} from '../controllers/sectionController.js';
import { verifyToken, checkRole } from '../middleware/authMiddleware.js';

const router = express.Router();

// GET /api/sections - Get all sections (authenticated users)
router.get('/', verifyToken, getAllSections);

// POST /api/sections - Create new section (Admin only)
router.post('/', verifyToken, checkRole('Admin'), createSection);

// PUT /api/sections/:id - Update section (Admin only)
router.put('/:id', verifyToken, checkRole('Admin'), updateSection);

// DELETE /api/sections/:id - Delete section (Admin only)
router.delete('/:id', verifyToken, checkRole('Admin'), deleteSection);

export default router;
