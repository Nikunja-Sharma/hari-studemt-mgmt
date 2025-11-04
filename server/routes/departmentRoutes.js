import express from 'express';
import {
    getAllDepartments,
    getDepartmentById,
    createDepartment,
    updateDepartment,
    deleteDepartment,
    getSectionsByDepartment
} from '../controllers/departmentController.js';
import { verifyToken, checkRole } from '../middleware/authMiddleware.js';

const router = express.Router();

// GET /api/departments - Get all departments (authenticated users)
router.get('/', verifyToken, getAllDepartments);

// GET /api/departments/:id - Get department by ID (authenticated users)
router.get('/:id', verifyToken, getDepartmentById);

// POST /api/departments - Create new department (Admin only)
router.post('/', verifyToken, checkRole('Admin'), createDepartment);

// PUT /api/departments/:id - Update department (Admin only)
router.put('/:id', verifyToken, checkRole('Admin'), updateDepartment);

// DELETE /api/departments/:id - Delete department (Admin only)
router.delete('/:id', verifyToken, checkRole('Admin'), deleteDepartment);

// GET /api/departments/:id/sections - Get sections by department (authenticated users)
router.get('/:id/sections', verifyToken, getSectionsByDepartment);

export default router;
