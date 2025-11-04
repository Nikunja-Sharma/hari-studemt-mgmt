import Student from '../models/Student.js';
import Department from '../models/Department.js';
import Section from '../models/Section.js';

// Get all students with optional filtering by department and section
export const getAllStudents = async (req, res) => {
    try {
        const { department, section, page = 1, limit = 10 } = req.query;
        
        // Build query object
        const query = {};
        if (department) {
            query.department = department;
        }
        if (section) {
            query.section = section;
        }

        // Calculate pagination
        const skip = (parseInt(page) - 1) * parseInt(limit);

        // Get students with populated references
        const students = await Student.findWithReferences(query)
            .skip(skip)
            .limit(parseInt(limit))
            .sort({ createdAt: -1 });

        // Get total count for pagination
        const total = await Student.countDocuments(query);

        res.json({
            success: true,
            data: students,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                pages: Math.ceil(total / parseInt(limit))
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: {
                message: 'Error retrieving students',
                code: 'SERVER_ERROR',
                details: error.message
            }
        });
    }
};

// Get student by ID with population of references
export const getStudentById = async (req, res) => {
    try {
        const { id } = req.params;

        const student = await Student.findByIdWithReferences(id);

        if (!student) {
            return res.status(404).json({
                success: false,
                error: {
                    message: 'Student not found',
                    code: 'STUDENT_NOT_FOUND'
                }
            });
        }

        res.json({
            success: true,
            data: student
        });
    } catch (error) {
        // Handle invalid ObjectId
        if (error.name === 'CastError') {
            return res.status(400).json({
                success: false,
                error: {
                    message: 'Invalid student ID',
                    code: 'INVALID_ID'
                }
            });
        }

        res.status(500).json({
            success: false,
            error: {
                message: 'Error retrieving student',
                code: 'SERVER_ERROR',
                details: error.message
            }
        });
    }
};

// Create new student with duplicate roll number check
export const createStudent = async (req, res) => {
    try {
        const { name, rollNumber, department, section, email, contact } = req.body;

        // Validate required fields
        if (!name || !rollNumber || !department || !section || !email || !contact) {
            return res.status(400).json({
                success: false,
                error: {
                    message: 'All fields are required: name, rollNumber, department, section, email, contact',
                    code: 'MISSING_REQUIRED_FIELDS'
                }
            });
        }

        // Check for duplicate roll number
        const existingStudent = await Student.findOne({ rollNumber: rollNumber.toUpperCase() });
        if (existingStudent) {
            return res.status(400).json({
                success: false,
                error: {
                    message: 'Roll number already exists',
                    code: 'DUPLICATE_ROLL_NUMBER'
                }
            });
        }

        // Check for duplicate email
        const existingEmail = await Student.findOne({ email: email.toLowerCase() });
        if (existingEmail) {
            return res.status(400).json({
                success: false,
                error: {
                    message: 'Email already exists',
                    code: 'DUPLICATE_EMAIL'
                }
            });
        }

        // Verify department exists
        const departmentExists = await Department.findById(department);
        if (!departmentExists) {
            return res.status(400).json({
                success: false,
                error: {
                    message: 'Department not found',
                    code: 'DEPARTMENT_NOT_FOUND'
                }
            });
        }

        // Verify section exists and belongs to the department
        const sectionExists = await Section.findById(section);
        if (!sectionExists) {
            return res.status(400).json({
                success: false,
                error: {
                    message: 'Section not found',
                    code: 'SECTION_NOT_FOUND'
                }
            });
        }

        if (sectionExists.department.toString() !== department) {
            return res.status(400).json({
                success: false,
                error: {
                    message: 'Section does not belong to the specified department',
                    code: 'SECTION_DEPARTMENT_MISMATCH'
                }
            });
        }

        // Create new student
        const student = new Student({
            name,
            rollNumber,
            department,
            section,
            email,
            contact
        });

        await student.save();

        // Populate references before returning
        await student.populateReferences();

        res.status(201).json({
            success: true,
            message: 'Student added successfully',
            data: student
        });
    } catch (error) {
        // Handle validation errors
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({
                success: false,
                error: {
                    message: messages.join(', '),
                    code: 'VALIDATION_ERROR',
                    details: error.errors
                }
            });
        }

        // Handle duplicate key errors
        if (error.code === 11000) {
            const field = Object.keys(error.keyPattern)[0];
            return res.status(400).json({
                success: false,
                error: {
                    message: `${field} already exists`,
                    code: 'DUPLICATE_FIELD'
                }
            });
        }

        res.status(500).json({
            success: false,
            error: {
                message: 'Error creating student',
                code: 'SERVER_ERROR',
                details: error.message
            }
        });
    }
};

// Update student with validation
export const updateStudent = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, rollNumber, department, section, email, contact } = req.body;

        // Find existing student
        const student = await Student.findById(id);
        if (!student) {
            return res.status(404).json({
                success: false,
                error: {
                    message: 'Student not found',
                    code: 'STUDENT_NOT_FOUND'
                }
            });
        }

        // Check for duplicate roll number (excluding current student)
        if (rollNumber && rollNumber.toUpperCase() !== student.rollNumber) {
            const existingStudent = await Student.findOne({ 
                rollNumber: rollNumber.toUpperCase(),
                _id: { $ne: id }
            });
            if (existingStudent) {
                return res.status(400).json({
                    success: false,
                    error: {
                        message: 'Roll number already exists',
                        code: 'DUPLICATE_ROLL_NUMBER'
                    }
                });
            }
        }

        // Check for duplicate email (excluding current student)
        if (email && email.toLowerCase() !== student.email) {
            const existingEmail = await Student.findOne({ 
                email: email.toLowerCase(),
                _id: { $ne: id }
            });
            if (existingEmail) {
                return res.status(400).json({
                    success: false,
                    error: {
                        message: 'Email already exists',
                        code: 'DUPLICATE_EMAIL'
                    }
                });
            }
        }

        // Verify department exists if being updated
        if (department && department !== student.department.toString()) {
            const departmentExists = await Department.findById(department);
            if (!departmentExists) {
                return res.status(400).json({
                    success: false,
                    error: {
                        message: 'Department not found',
                        code: 'DEPARTMENT_NOT_FOUND'
                    }
                });
            }
        }

        // Verify section exists if being updated
        if (section && section !== student.section.toString()) {
            const sectionExists = await Section.findById(section);
            if (!sectionExists) {
                return res.status(400).json({
                    success: false,
                    error: {
                        message: 'Section not found',
                        code: 'SECTION_NOT_FOUND'
                    }
                });
            }

            // Verify section belongs to department
            const deptId = department || student.department.toString();
            if (sectionExists.department.toString() !== deptId) {
                return res.status(400).json({
                    success: false,
                    error: {
                        message: 'Section does not belong to the specified department',
                        code: 'SECTION_DEPARTMENT_MISMATCH'
                    }
                });
            }
        }

        // Update fields
        if (name) student.name = name;
        if (rollNumber) student.rollNumber = rollNumber;
        if (department) student.department = department;
        if (section) student.section = section;
        if (email) student.email = email;
        if (contact) student.contact = contact;

        await student.save();

        // Populate references before returning
        await student.populateReferences();

        res.json({
            success: true,
            message: 'Student updated successfully',
            data: student
        });
    } catch (error) {
        // Handle validation errors
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({
                success: false,
                error: {
                    message: messages.join(', '),
                    code: 'VALIDATION_ERROR',
                    details: error.errors
                }
            });
        }

        // Handle invalid ObjectId
        if (error.name === 'CastError') {
            return res.status(400).json({
                success: false,
                error: {
                    message: 'Invalid student ID',
                    code: 'INVALID_ID'
                }
            });
        }

        res.status(500).json({
            success: false,
            error: {
                message: 'Error updating student',
                code: 'SERVER_ERROR',
                details: error.message
            }
        });
    }
};

// Delete student with authorization check (handled by middleware)
export const deleteStudent = async (req, res) => {
    try {
        const { id } = req.params;

        const student = await Student.findById(id);
        if (!student) {
            return res.status(404).json({
                success: false,
                error: {
                    message: 'Student not found',
                    code: 'STUDENT_NOT_FOUND'
                }
            });
        }

        await Student.findByIdAndDelete(id);

        res.json({
            success: true,
            message: 'Student deleted successfully'
        });
    } catch (error) {
        // Handle invalid ObjectId
        if (error.name === 'CastError') {
            return res.status(400).json({
                success: false,
                error: {
                    message: 'Invalid student ID',
                    code: 'INVALID_ID'
                }
            });
        }

        res.status(500).json({
            success: false,
            error: {
                message: 'Error deleting student',
                code: 'SERVER_ERROR',
                details: error.message
            }
        });
    }
};

// Search students by name or roll number
export const searchStudents = async (req, res) => {
    try {
        const { q, page = 1, limit = 10 } = req.query;

        if (!q) {
            return res.status(400).json({
                success: false,
                error: {
                    message: 'Search query parameter "q" is required',
                    code: 'MISSING_SEARCH_QUERY'
                }
            });
        }

        // Build search query using regex for partial matching
        const searchQuery = {
            $or: [
                { name: { $regex: q, $options: 'i' } },
                { rollNumber: { $regex: q, $options: 'i' } }
            ]
        };

        // Calculate pagination
        const skip = (parseInt(page) - 1) * parseInt(limit);

        // Search students with populated references
        const students = await Student.findWithReferences(searchQuery)
            .skip(skip)
            .limit(parseInt(limit))
            .sort({ createdAt: -1 });

        // Get total count for pagination
        const total = await Student.countDocuments(searchQuery);

        res.json({
            success: true,
            data: students,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                pages: Math.ceil(total / parseInt(limit))
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: {
                message: 'Error searching students',
                code: 'SERVER_ERROR',
                details: error.message
            }
        });
    }
};
