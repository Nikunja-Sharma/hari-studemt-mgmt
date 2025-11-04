import Student from '../models/Student.js';
import Department from '../models/Department.js';
import Section from '../models/Section.js';

// Generate department report
export const generateDepartmentReport = async (req, res) => {
    try {
        const { department: departmentId, startDate, endDate } = req.query;

        // Build query
        const query = {};
        if (departmentId) {
            query.department = departmentId;
        }

        // Add date range filter if provided
        if (startDate || endDate) {
            query.createdAt = {};
            if (startDate) query.createdAt.$gte = new Date(startDate);
            if (endDate) query.createdAt.$lte = new Date(endDate);
        }

        // Get students with populated references
        const students = await Student.findWithReferences(query);

        // Get department info
        let departmentInfo = null;
        if (departmentId) {
            departmentInfo = await Department.findById(departmentId);
        }

        // Format students for frontend
        const formattedStudents = students.map(student => ({
            _id: student._id,
            name: student.name,
            rollNumber: student.rollNumber,
            email: student.email,
            contact: student.contact,
            department: {
                _id: student.department._id,
                name: student.department.name,
                code: student.department.code
            },
            section: {
                _id: student.section._id,
                name: student.section.name
            }
        }));

        res.status(200).json({
            success: true,
            data: {
                summary: {
                    totalStudents: students.length,
                    departmentName: departmentInfo?.name || 'All Departments'
                },
                students: formattedStudents
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: {
                message: 'Error generating department report',
                code: 'REPORT_ERROR',
                details: error.message
            }
        });
    }
};

// Generate section report
export const generateSectionReport = async (req, res) => {
    try {
        const { section: sectionId, department: departmentId, startDate, endDate } = req.query;

        // Build query
        const query = {};
        if (sectionId) {
            query.section = sectionId;
        }
        if (departmentId) {
            query.department = departmentId;
        }

        // Add date range filter if provided
        if (startDate || endDate) {
            query.createdAt = {};
            if (startDate) query.createdAt.$gte = new Date(startDate);
            if (endDate) query.createdAt.$lte = new Date(endDate);
        }

        // Get students with populated references
        const students = await Student.findWithReferences(query);

        // Get section and department info
        let sectionInfo = null;
        let departmentInfo = null;
        if (sectionId) {
            sectionInfo = await Section.findById(sectionId).populate('department');
            departmentInfo = sectionInfo?.department;
        } else if (departmentId) {
            departmentInfo = await Department.findById(departmentId);
        }

        // Format students for frontend
        const formattedStudents = students.map(student => ({
            _id: student._id,
            name: student.name,
            rollNumber: student.rollNumber,
            email: student.email,
            contact: student.contact,
            department: {
                _id: student.department._id,
                name: student.department.name,
                code: student.department.code
            },
            section: {
                _id: student.section._id,
                name: student.section.name
            }
        }));

        res.status(200).json({
            success: true,
            data: {
                summary: {
                    totalStudents: students.length,
                    departmentName: departmentInfo?.name,
                    sectionName: sectionInfo?.name
                },
                students: formattedStudents
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: {
                message: 'Error generating section report',
                code: 'REPORT_ERROR',
                details: error.message
            }
        });
    }
};

// Generate complete report
export const generateCompleteReport = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;

        // Build query
        const query = {};

        // Add date range filter if provided
        if (startDate || endDate) {
            query.createdAt = {};
            if (startDate) query.createdAt.$gte = new Date(startDate);
            if (endDate) query.createdAt.$lte = new Date(endDate);
        }

        // Get all students with populated references
        const students = await Student.findWithReferences(query);

        // Format students for frontend
        const formattedStudents = students.map(student => ({
            _id: student._id,
            name: student.name,
            rollNumber: student.rollNumber,
            email: student.email,
            contact: student.contact,
            department: {
                _id: student.department._id,
                name: student.department.name,
                code: student.department.code
            },
            section: {
                _id: student.section._id,
                name: student.section.name
            }
        }));

        res.status(200).json({
            success: true,
            data: {
                summary: {
                    totalStudents: students.length
                },
                students: formattedStudents
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: {
                message: 'Error generating complete report',
                code: 'REPORT_ERROR',
                details: error.message
            }
        });
    }
};

// Export report to CSV format
export const exportToCSV = async (req, res) => {
    try {
        const { department: departmentId, section: sectionId, startDate, endDate } = req.query;

        // Build query based on filters
        const query = {};
        if (departmentId) query.department = departmentId;
        if (sectionId) query.section = sectionId;
        
        if (startDate || endDate) {
            query.createdAt = {};
            if (startDate) query.createdAt.$gte = new Date(startDate);
            if (endDate) query.createdAt.$lte = new Date(endDate);
        }

        // Get students with populated references
        const students = await Student.findWithReferences(query);

        // Generate CSV content
        const csvHeaders = 'Roll Number,Name,Email,Contact,Department,Section\n';
        const csvRows = students.map(student => {
            return `"${student.rollNumber}","${student.name}","${student.email}","${student.contact}","${student.department.name}","${student.section.name}"`;
        }).join('\n');

        const csvContent = csvHeaders + csvRows;

        // Set response headers for CSV download
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', `attachment; filename="student-report-${Date.now()}.csv"`);
        
        res.status(200).send(csvContent);
    } catch (error) {
        res.status(500).json({
            success: false,
            error: {
                message: 'Error exporting report to CSV',
                code: 'EXPORT_ERROR',
                details: error.message
            }
        });
    }
};
