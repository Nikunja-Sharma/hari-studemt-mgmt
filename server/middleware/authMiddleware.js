import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Middleware to verify JWT token
export const verifyToken = async (req, res, next) => {
    try {
        // Get token from cookie (preferred) or Authorization header (fallback)
        let token = req.cookies?.token;
        
        // Fallback to Authorization header if cookie is not present
        if (!token) {
            const authHeader = req.headers.authorization;
            
            if (authHeader && authHeader.startsWith('Bearer ')) {
                token = authHeader.substring(7); // Remove 'Bearer ' prefix
            }
        }

        if (!token) {
            return res.status(401).json({
                success: false,
                error: {
                    message: 'No token provided',
                    code: 'MISSING_TOKEN'
                }
            });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');

        // Get user from database
        const user = await User.findById(decoded.userId).select('-password');
        
        if (!user) {
            return res.status(401).json({
                success: false,
                error: {
                    message: 'User not found',
                    code: 'USER_NOT_FOUND'
                }
            });
        }

        // Attach user to request object
        req.user = user;
        req.userId = decoded.userId;
        req.userRole = decoded.role;

        next();
    } catch (error) {
        // Handle token expiration
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                error: {
                    message: 'Token has expired',
                    code: 'TOKEN_EXPIRED'
                }
            });
        }

        // Handle invalid token
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({
                success: false,
                error: {
                    message: 'Invalid token',
                    code: 'INVALID_TOKEN'
                }
            });
        }

        // Handle other errors
        return res.status(500).json({
            success: false,
            error: {
                message: 'Error verifying token',
                code: 'SERVER_ERROR',
                details: error.message
            }
        });
    }
};

// Middleware to check user role
export const checkRole = (...allowedRoles) => {
    return (req, res, next) => {
        try {
            // Ensure user is authenticated first
            if (!req.user || !req.userRole) {
                return res.status(401).json({
                    success: false,
                    error: {
                        message: 'Authentication required',
                        code: 'AUTHENTICATION_REQUIRED'
                    }
                });
            }

            // Check if user's role is in the allowed roles
            if (!allowedRoles.includes(req.userRole)) {
                return res.status(403).json({
                    success: false,
                    error: {
                        message: 'Insufficient permissions',
                        code: 'INSUFFICIENT_PERMISSIONS',
                        details: `Required role: ${allowedRoles.join(' or ')}`
                    }
                });
            }

            next();
        } catch (error) {
            return res.status(500).json({
                success: false,
                error: {
                    message: 'Error checking permissions',
                    code: 'SERVER_ERROR',
                    details: error.message
                }
            });
        }
    };
};
