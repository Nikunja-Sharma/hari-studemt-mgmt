import express from 'express';
import {
    generateDepartmentReport,
    generateSectionReport,
    generateCompleteReport,
    exportToCSV
} from '../controllers/reportController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// GET /api/reports/department - Generate department report (authenticated users)
router.get('/department', verifyToken, generateDepartmentReport);

// GET /api/reports/section - Generate section report (authenticated users)
router.get('/section', verifyToken, generateSectionReport);

// GET /api/reports/complete - Generate complete report (authenticated users)
router.get('/complete', verifyToken, generateCompleteReport);

// GET /api/reports/export/csv - Export report to CSV (authenticated users)
router.get('/export/csv', verifyToken, exportToCSV);

export default router;
