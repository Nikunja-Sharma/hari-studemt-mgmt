import express from 'express';
import {
    getAllStudents,
    getStudentById,
    createStudent,
    updateStudent,
    deleteStudent,
    searchStudents
} from '../controllers/studentController.js';
import { verifyToken, checkRole } from '../middleware/authMiddleware.js';

const router = express.Router();

// Search students by name or roll number (protected - all authenticated users)
// This route must come before /:id to avoid treating 'search' as an ID
router.get('/search', verifyToken, searchStudents);

// Get all students with optional filtering by department and section (protected - all authenticated users)
router.get('/', verifyToken, getAllStudents);

// Get student by ID (protected - all authenticated users)
router.get('/:id', verifyToken, getStudentById);

// Create new student (Admin and Faculty access)
router.post('/', verifyToken, checkRole('Admin', 'Faculty'), createStudent);

// Update student (Admin only)
router.put('/:id', verifyToken, checkRole('Admin'), updateStudent);

// Delete student (Admin only)
router.delete('/:id', verifyToken, checkRole('Admin'), deleteStudent);

export default router;
