import Section from '../models/Section.js';
import Department from '../models/Department.js';
import Student from '../models/Student.js';

// Get all sections
export const getAllSections = async (req, res) => {
    try {
        const sections = await Section.find()
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

// Create new section with department association
export const createSection = async (req, res) => {
    try {
        const { name, department, capacity } = req.body;
        
        // Validate required fields
        if (!name || !department) {
            return res.status(400).json({
                success: false,
                error: {
                    message: 'Name and department are required',
                    code: 'VALIDATION_ERROR'
                }
            });
        }
        
        // Verify department exists
        const departmentExists = await Department.findById(department);
        
        if (!departmentExists) {
            return res.status(404).json({
                success: false,
                error: {
                    message: 'Department not found',
                    code: 'NOT_FOUND'
                }
            });
        }
        
        // Check for duplicate section name within the department
        const existingSection = await Section.findOne({
            name,
            department
        });
        
        if (existingSection) {
            return res.status(400).json({
                success: false,
                error: {
                    message: 'Section name already exists in this department',
                    code: 'DUPLICATE_ENTRY'
                }
            });
        }
        
        const section = await Section.create({
            name,
            department,
            capacity: capacity || 60,
            currentStrength: 0
        });
        
        // Populate department before sending response
        await section.populate('department');
        
        res.status(201).json({
            success: true,
            message: 'Section created successfully',
            data: section
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                error: {
                    message: 'Section name already exists in this department',
                    code: 'DUPLICATE_ENTRY'
                }
            });
        }
        
        res.status(500).json({
            success: false,
            error: {
                message: 'Error creating section',
                code: 'CREATE_ERROR',
                details: error.message
            }
        });
    }
};

// Update section
export const updateSection = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, department, capacity, currentStrength } = req.body;
        
        const section = await Section.findById(id);
        
        if (!section) {
            return res.status(404).json({
                success: false,
                error: {
                    message: 'Section not found',
                    code: 'NOT_FOUND'
                }
            });
        }
        
        // If department is being changed, verify it exists
        if (department && department !== section.department.toString()) {
            const departmentExists = await Department.findById(department);
            
            if (!departmentExists) {
                return res.status(404).json({
                    success: false,
                    error: {
                        message: 'Department not found',
                        code: 'NOT_FOUND'
                    }
                });
            }
        }
        
        // Check for duplicate section name within the department
        if (name || department) {
            const checkDepartment = department || section.department;
            const checkName = name || section.name;
            
            const existingSection = await Section.findOne({
                _id: { $ne: id },
                name: checkName,
                department: checkDepartment
            });
            
            if (existingSection) {
                return res.status(400).json({
                    success: false,
                    error: {
                        message: 'Section name already exists in this department',
                        code: 'DUPLICATE_ENTRY'
                    }
                });
            }
        }
        
        // Update fields
        if (name) section.name = name;
        if (department) section.department = department;
        if (capacity !== undefined) section.capacity = capacity;
        if (currentStrength !== undefined) section.currentStrength = currentStrength;
        
        await section.save();
        await section.populate('department');
        
        res.status(200).json({
            success: true,
            message: 'Section updated successfully',
            data: section
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                error: {
                    message: 'Section name already exists in this department',
                    code: 'DUPLICATE_ENTRY'
                }
            });
        }
        
        res.status(500).json({
            success: false,
            error: {
                message: 'Error updating section',
                code: 'UPDATE_ERROR',
                details: error.message
            }
        });
    }
};

// Delete section with student count check
export const deleteSection = async (req, res) => {
    try {
        const { id } = req.params;
        
        const section = await Section.findById(id);
        
        if (!section) {
            return res.status(404).json({
                success: false,
                error: {
                    message: 'Section not found',
                    code: 'NOT_FOUND'
                }
            });
        }
        
        // Check if section has associated students
        const studentCount = await Student.countDocuments({ section: id });
        
        if (studentCount > 0) {
            return res.status(400).json({
                success: false,
                error: {
                    message: `Cannot delete section. ${studentCount} student(s) are associated with this section`,
                    code: 'CONSTRAINT_VIOLATION',
                    details: { studentCount }
                }
            });
        }
        
        await Section.findByIdAndDelete(id);
        
        res.status(200).json({
            success: true,
            message: 'Section deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: {
                message: 'Error deleting section',
                code: 'DELETE_ERROR',
                details: error.message
            }
        });
    }
};
