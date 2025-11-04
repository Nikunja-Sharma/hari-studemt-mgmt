import Department from '../models/Department.js';
import Section from '../models/Section.js';
import Student from '../models/Student.js';

// Get all departments
export const getAllDepartments = async (req, res) => {
    try {
        const departments = await Department.find().sort({ name: 1 });
        
        res.status(200).json({
            success: true,
            count: departments.length,
            data: departments
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: {
                message: 'Error retrieving departments',
                code: 'FETCH_ERROR',
                details: error.message
            }
        });
    }
};

// Get department by ID
export const getDepartmentById = async (req, res) => {
    try {
        const { id } = req.params;
        
        const department = await Department.findById(id);
        
        if (!department) {
            return res.status(404).json({
                success: false,
                error: {
                    message: 'Department not found',
                    code: 'NOT_FOUND'
                }
            });
        }
        
        res.status(200).json({
            success: true,
            data: department
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: {
                message: 'Error retrieving department',
                code: 'FETCH_ERROR',
                details: error.message
            }
        });
    }
};

// Create new department
export const createDepartment = async (req, res) => {
    try {
        const { name, code, description } = req.body;
        
        // Validate required fields
        if (!name || !code) {
            return res.status(400).json({
                success: false,
                error: {
                    message: 'Name and code are required',
                    code: 'VALIDATION_ERROR'
                }
            });
        }
        
        // Check for duplicate name or code
        const existingDepartment = await Department.findOne({
            $or: [{ name }, { code: code.toUpperCase() }]
        });
        
        if (existingDepartment) {
            return res.status(400).json({
                success: false,
                error: {
                    message: existingDepartment.name === name 
                        ? 'Department name already exists' 
                        : 'Department code already exists',
                    code: 'DUPLICATE_ENTRY'
                }
            });
        }
        
        const department = await Department.create({
            name,
            code: code.toUpperCase(),
            description
        });
        
        res.status(201).json({
            success: true,
            message: 'Department created successfully',
            data: department
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                error: {
                    message: 'Department name or code already exists',
                    code: 'DUPLICATE_ENTRY'
                }
            });
        }
        
        res.status(500).json({
            success: false,
            error: {
                message: 'Error creating department',
                code: 'CREATE_ERROR',
                details: error.message
            }
        });
    }
};

// Update department
export const updateDepartment = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, code, description } = req.body;
        
        const department = await Department.findById(id);
        
        if (!department) {
            return res.status(404).json({
                success: false,
                error: {
                    message: 'Department not found',
                    code: 'NOT_FOUND'
                }
            });
        }
        
        // Check for duplicate name or code (excluding current department)
        if (name || code) {
            const duplicateQuery = {
                _id: { $ne: id },
                $or: []
            };
            
            if (name) duplicateQuery.$or.push({ name });
            if (code) duplicateQuery.$or.push({ code: code.toUpperCase() });
            
            const existingDepartment = await Department.findOne(duplicateQuery);
            
            if (existingDepartment) {
                return res.status(400).json({
                    success: false,
                    error: {
                        message: existingDepartment.name === name 
                            ? 'Department name already exists' 
                            : 'Department code already exists',
                        code: 'DUPLICATE_ENTRY'
                    }
                });
            }
        }
        
        // Update fields
        if (name) department.name = name;
        if (code) department.code = code.toUpperCase();
        if (description !== undefined) department.description = description;
        
        await department.save();
        
        res.status(200).json({
            success: true,
            message: 'Department updated successfully',
            data: department
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                error: {
                    message: 'Department name or code already exists',
                    code: 'DUPLICATE_ENTRY'
                }
            });
        }
        
        res.status(500).json({
            success: false,
            error: {
                message: 'Error updating department',
                code: 'UPDATE_ERROR',
                details: error.message
            }
        });
    }
};

// Delete department with student count check
export const deleteDepartment = async (req, res) => {
    try {
        const { id } = req.params;
        
        const department = await Department.findById(id);
        
        if (!department) {
            return res.status(404).json({
                success: false,
                error: {
                    message: 'Department not found',
                    code: 'NOT_FOUND'
                }
            });
        }
        
        // Check if department has associated students
        const studentCount = await Student.countDocuments({ department: id });
        
        if (studentCount > 0) {
            return res.status(400).json({
                success: false,
                error: {
                    message: `Cannot delete department. ${studentCount} student(s) are associated with this department`,
                    code: 'CONSTRAINT_VIOLATION',
                    details: { studentCount }
                }
            });
        }
        
        // Check if department has associated sections
        const sectionCount = await Section.countDocuments({ department: id });
        
        if (sectionCount > 0) {
            return res.status(400).json({
                success: false,
                error: {
                    message: `Cannot delete department. ${sectionCount} section(s) are associated with this department`,
                    code: 'CONSTRAINT_VIOLATION',
                    details: { sectionCount }
                }
            });
        }
        
        await Department.findByIdAndDelete(id);
        
        res.status(200).json({
            success: true,
            message: 'Department deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: {
                message: 'Error deleting department',
                code: 'DELETE_ERROR',
                details: error.message
            }
        });
    }
};

// Get sections by department
export const getSectionsByDepartment = async (req, res) => {
    try {
        const { id } = req.params;
        
        // Verify department exists
        const department = await Department.findById(id);
        
        if (!department) {
            return res.status(404).json({
                success: false,
                error: {
                    message: 'Department not found',
                    code: 'NOT_FOUND'
                }
            });
        }
        
        const sections = await Section.find({ department: id })
            .populate('department')
            .sort({ name: 1 });
        
        res.status(200).json({
            success: true,
            count: sections.length,
            data: sections
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: {
                message: 'Error retrieving sections',
                code: 'FETCH_ERROR',
                details: error.message
            }
        });
    }
};
