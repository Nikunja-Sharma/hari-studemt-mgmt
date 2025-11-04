// Centralized error handling middleware

// Mongoose validation error formatter
const handleMongooseValidationError = (error) => {
    const errors = Object.values(error.errors).map(err => ({
        field: err.path,
        message: err.message
    }));
    
    return {
        message: 'Validation failed',
        code: 'VALIDATION_ERROR',
        errors
    };
};

// Mongoose duplicate key error formatter
const handleMongoDuplicateKeyError = (error) => {
    const field = Object.keys(error.keyPattern)[0];
    return {
        message: `${field} already exists`,
        code: 'DUPLICATE_ENTRY',
        field
    };
};

// Mongoose cast error formatter (invalid ObjectId)
const handleMongoCastError = (error) => {
    return {
        message: `Invalid ${error.path}: ${error.value}`,
        code: 'INVALID_ID'
    };
};

// JWT error handler
const handleJWTError = (error) => {
    if (error.name === 'TokenExpiredError') {
        return {
            message: 'Token has expired',
            code: 'TOKEN_EXPIRED'
        };
    }
    
    if (error.name === 'JsonWebTokenError') {
        return {
            message: 'Invalid token',
            code: 'INVALID_TOKEN'
        };
    }
    
    return {
        message: 'Authentication error',
        code: 'AUTH_ERROR'
    };
};

// Database connection error handler
const handleDatabaseError = (error) => {
    return {
        message: 'Database connection error',
        code: 'DATABASE_ERROR',
        details: error.message
    };
};

// Main error handling middleware
export const errorHandler = (err, req, res, next) => {
    console.error('Error:', err);

    let statusCode = err.statusCode || 500;
    let errorResponse = {
        success: false,
        error: {
            message: err.message || 'Internal server error',
            code: err.code || 'SERVER_ERROR'
        }
    };

    // Handle Mongoose validation errors
    if (err.name === 'ValidationError') {
        statusCode = 400;
        errorResponse.error = handleMongooseValidationError(err);
    }
    
    // Handle Mongoose duplicate key errors
    else if (err.code === 11000) {
        statusCode = 400;
        errorResponse.error = handleMongoDuplicateKeyError(err);
    }
    
    // Handle Mongoose cast errors (invalid ObjectId)
    else if (err.name === 'CastError') {
        statusCode = 400;
        errorResponse.error = handleMongoCastError(err);
    }
    
    // Handle JWT errors
    else if (err.name === 'TokenExpiredError' || err.name === 'JsonWebTokenError') {
        statusCode = 401;
        errorResponse.error = handleJWTError(err);
    }
    
    // Handle MongoDB connection errors
    else if (err.name === 'MongoError' || err.name === 'MongoServerError') {
        statusCode = 503;
        errorResponse.error = handleDatabaseError(err);
    }
    
    // Handle custom errors with details
    else if (err.details) {
        errorResponse.error.details = err.details;
    }

    // Don't expose internal error details in production
    if (process.env.NODE_ENV === 'production' && statusCode === 500) {
        errorResponse.error.message = 'Internal server error';
        delete errorResponse.error.details;
    }

    res.status(statusCode).json(errorResponse);
};

// 404 Not Found handler
export const notFoundHandler = (req, res, next) => {
    res.status(404).json({
        success: false,
        error: {
            message: `Route ${req.originalUrl} not found`,
            code: 'NOT_FOUND'
        }
    });
};

// Async error wrapper to catch errors in async route handlers
export const asyncHandler = (fn) => {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};
