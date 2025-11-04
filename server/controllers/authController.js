import User from '../models/User.js';
import jwt from 'jsonwebtoken';

// Register a new user (Admin only - enforced at route level)
export const register = async (req, res) => {
    try {
        const { username, email, password, role } = req.body;

        // Validate required fields
        if (!username || !email || !password) {
            return res.status(400).json({ 
                success: false,
                error: {
                    message: 'Username, email, and password are required',
                    code: 'MISSING_REQUIRED_FIELDS'
                }
            });
        }

        // Check if user already exists by email
        const existingUserByEmail = await User.findOne({ email });
        if (existingUserByEmail) {
            return res.status(400).json({ 
                success: false,
                error: {
                    message: 'User with this email already exists',
                    code: 'DUPLICATE_EMAIL'
                }
            });
        }

        // Check if user already exists by username
        const existingUserByUsername = await User.findOne({ username });
        if (existingUserByUsername) {
            return res.status(400).json({ 
                success: false,
                error: {
                    message: 'User with this username already exists',
                    code: 'DUPLICATE_USERNAME'
                }
            });
        }

        // Create new user (password will be hashed by pre-save middleware)
        const user = new User({
            username,
            email,
            password,
            role: role || 'Faculty' // Default to Faculty if not specified
        });

        await user.save();

        // Create JWT token with 24-hour expiration
        const token = jwt.sign(
            { 
                userId: user._id,
                role: user.role 
            },
            process.env.JWT_SECRET || 'your-secret-key',
            { expiresIn: '24h' }
        );

        // Set HTTP-only cookie
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 24 * 60 * 60 * 1000 // 24 hours
        });

        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role
            }
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

        res.status(500).json({ 
            success: false,
            error: {
                message: 'Error registering user',
                code: 'SERVER_ERROR',
                details: error.message
            }
        });
    }
};

// Public signup (self-registration)
export const signup = async (req, res) => {
    try {
        const { username, email, password, role } = req.body;

        // Validate required fields
        if (!username || !email || !password) {
            return res.status(400).json({ 
                success: false,
                error: {
                    message: 'Username, email, and password are required',
                    code: 'MISSING_REQUIRED_FIELDS'
                }
            });
        }

        // Check if user already exists by email
        const existingUserByEmail = await User.findOne({ email });
        if (existingUserByEmail) {
            return res.status(400).json({ 
                success: false,
                error: {
                    message: 'User with this email already exists',
                    code: 'DUPLICATE_EMAIL'
                }
            });
        }

        // Check if user already exists by username
        const existingUserByUsername = await User.findOne({ username });
        if (existingUserByUsername) {
            return res.status(400).json({ 
                success: false,
                error: {
                    message: 'User with this username already exists',
                    code: 'DUPLICATE_USERNAME'
                }
            });
        }

        // For public signup, only allow Faculty role (not Admin)
        const userRole = role === 'Admin' ? 'Faculty' : (role || 'Faculty');

        // Create new user (password will be hashed by pre-save middleware)
        const user = new User({
            username,
            email,
            password,
            role: userRole
        });

        await user.save();

        res.status(201).json({
            success: true,
            message: 'User registered successfully. Please login to continue.',
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role
            }
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

        res.status(500).json({ 
            success: false,
            error: {
                message: 'Error registering user',
                code: 'SERVER_ERROR',
                details: error.message
            }
        });
    }
};

// Login user
export const login = async (req, res) => {
    try {
        const { email, password, username } = req.body;

        // Validate that either email or username is provided
        if (!email && !username) {
            return res.status(400).json({ 
                success: false,
                error: {
                    message: 'Email or username is required',
                    code: 'MISSING_CREDENTIALS'
                }
            });
        }

        if (!password) {
            return res.status(400).json({ 
                success: false,
                error: {
                    message: 'Password is required',
                    code: 'MISSING_PASSWORD'
                }
            });
        }

        // Find user by email or username
        const query = email ? { email } : { username };
        const user = await User.findOne(query);
        
        if (!user) {
            return res.status(401).json({ 
                success: false,
                error: {
                    message: 'Invalid credentials',
                    code: 'INVALID_CREDENTIALS'
                }
            });
        }

        // Verify password
        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            return res.status(401).json({ 
                success: false,
                error: {
                    message: 'Invalid credentials',
                    code: 'INVALID_CREDENTIALS'
                }
            });
        }

        // Generate JWT token with 24-hour expiration
        const token = jwt.sign(
            { 
                userId: user._id,
                role: user.role 
            },
            process.env.JWT_SECRET || 'your-secret-key',
            { expiresIn: '24h' }
        );

        // Set HTTP-only cookie
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // Use secure in production
            sameSite: 'strict',
            maxAge: 24 * 60 * 60 * 1000 // 24 hours
        });

        res.json({
            success: true,
            message: 'Login successful',
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        res.status(500).json({ 
            success: false,
            error: {
                message: 'Error logging in',
                code: 'SERVER_ERROR',
                details: error.message
            }
        });
    }
};

// Logout user
export const logout = async (req, res) => {
    try {
        // Clear the token cookie
        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict'
        });

        res.json({
            success: true,
            message: 'Logout successful'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: {
                message: 'Error logging out',
                code: 'SERVER_ERROR',
                details: error.message
            }
        });
    }
}; 