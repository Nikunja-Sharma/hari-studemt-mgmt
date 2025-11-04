import { body, param, query, validationResult } from 'express-validator';

// Validation result handler
export const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            error: {
                message: 'Validation failed',
                code: 'VALIDATION_ERROR',
                errors: errors.array().map(err => ({
                    field: err.path,
                    message: err.msg,
                    value: err.value
                }))
            }
        });
    }
    
    next();
};

// Student validation rules
export const validateStudent = [
    body('name')
        .trim()
        .notEmpty().withMessage('Name is required')
        .isLength({ min: 2, max: 100 }).withMessage('Name must be between 2 and 100 characters'),
    
    body('rollNumber')
        .trim()
        .notEmpty().withMessage('Roll number is required')
        .isLength({ min: 1, max: 20 }).withMessage('Roll number must be between 1 and 20 characters')
        .toUpperCase(),
    
    body('email')
        .trim()
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Invalid email format')
        .normalizeEmail(),
    
    body('contact')
        .trim()
        .notEmpty().withMessage('Contact number is required')
        .matches(/^[0-9]{10}$/).withMessage('Contact must be a valid 10-digit number'),
    
    body('department')
        .notEmpty().withMessage('Department is required')
        .isMongoId().withMessage('Invalid department ID'),
    
    body('section')
        .notEmpty().withMessage('Section is required')
        .isMongoId().withMessage('Invalid section ID'),
    
    handleValidationErrors
];

// Department validation rules
export const validateDepartment = [
    body('name')
        .trim()
        .notEmpty().withMessage('Department name is required')
        .isLength({ min: 2, max: 100 }).withMessage('Name must be between 2 and 100 characters'),
    
    body('code')
        .trim()
        .notEmpty().withMessage('Department code is required')
        .isLength({ min: 2, max: 10 }).withMessage('Code must be between 2 and 10 characters')
        .toUpperCase(),
    
    body('description')
        .optional()
        .trim()
        .isLength({ max: 500 }).withMessage('Description must not exceed 500 characters'),
    
    handleValidationErrors
];

// Section validation rules
export const validateSection = [
    body('name')
        .trim()
        .notEmpty().withMessage('Section name is required')
        .isLength({ min: 1, max: 50 }).withMessage('Name must be between 1 and 50 characters'),
    
    body('department')
        .notEmpty().withMessage('Department is required')
        .isMongoId().withMessage('Invalid department ID'),
    
    body('capacity')
        .optional()
        .isInt({ min: 1, max: 500 }).withMessage('Capacity must be between 1 and 500'),
    
    handleValidationErrors
];

// User registration validation rules
export const validateUserRegistration = [
    body('username')
        .trim()
        .notEmpty().withMessage('Username is required')
        .isLength({ min: 3, max: 30 }).withMessage('Username must be between 3 and 30 characters')
        .matches(/^[a-zA-Z0-9_]+$/).withMessage('Username can only contain letters, numbers, and underscores'),
    
    body('email')
        .trim()
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Invalid email format')
        .normalizeEmail(),
    
    body('password')
        .notEmpty().withMessage('Password is required')
        .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/).withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),
    
    body('role')
        .optional()
        .isIn(['Admin', 'Faculty']).withMessage('Role must be either Admin or Faculty'),
    
    handleValidationErrors
];

// User login validation rules
export const validateUserLogin = [
    body('email')
        .trim()
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Invalid email format')
        .normalizeEmail(),
    
    body('password')
        .notEmpty().withMessage('Password is required'),
    
    handleValidationErrors
];

// MongoDB ObjectId validation
export const validateObjectId = (paramName = 'id') => [
    param(paramName)
        .isMongoId().withMessage(`Invalid ${paramName}`),
    
    handleValidationErrors
];

// Query parameter validation for reports
export const validateReportQuery = [
    query('departmentId')
        .optional()
        .isMongoId().withMessage('Invalid department ID'),
    
    query('sectionId')
        .optional()
        .isMongoId().withMessage('Invalid section ID'),
    
    query('startDate')
        .optional()
        .isISO8601().withMessage('Invalid start date format (use ISO 8601)'),
    
    query('endDate')
        .optional()
        .isISO8601().withMessage('Invalid end date format (use ISO 8601)'),
    
    handleValidationErrors
];

// Search query validation
export const validateSearchQuery = [
    query('q')
        .optional()
        .trim()
        .isLength({ min: 1, max: 100 }).withMessage('Search query must be between 1 and 100 characters'),
    
    query('department')
        .optional()
        .isMongoId().withMessage('Invalid department ID'),
    
    query('section')
        .optional()
        .isMongoId().withMessage('Invalid section ID'),
    
    handleValidationErrors
];
