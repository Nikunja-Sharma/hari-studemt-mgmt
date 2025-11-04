import User from '../models/User.js';

// Get all users (Admin only)
export const getAllUsers = async (req, res) => {
    try {
        const { role, search, page = 1, limit = 10 } = req.query;
        
        // Build query
        const query = {};
        
        // Filter by role if specified
        if (role && ['Admin', 'Faculty'].includes(role)) {
            query.role = role;
        }
        
        // Search by username or email
        if (search) {
            query.$or = [
                { username: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } },
                { 'profile.firstName': { $regex: search, $options: 'i' } },
                { 'profile.lastName': { $regex: search, $options: 'i' } }
            ];
        }
        
        // Calculate pagination
        const skip = (parseInt(page) - 1) * parseInt(limit);
        
        // Get users with pagination
        const users = await User.find(query)
            .select('-password -security.passwordHistory -security.twoFactorSecret')
            .populate('bannedBy', 'username email')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit));
        
        // Get total count for pagination
        const total = await User.countDocuments(query);
        
        res.json({
            success: true,
            data: {
                users,
                pagination: {
                    page: parseInt(page),
                    limit: parseInt(limit),
                    total,
                    pages: Math.ceil(total / parseInt(limit))
                }
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: {
                message: 'Error fetching users',
                code: 'SERVER_ERROR',
                details: error.message
            }
        });
    }
};

// Get user by ID (Admin only)
export const getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        
        const user = await User.findById(id)
            .select('-password -security.passwordHistory -security.twoFactorSecret')
            .populate('bannedBy', 'username email');
        
        if (!user) {
            return res.status(404).json({
                success: false,
                error: {
                    message: 'User not found',
                    code: 'USER_NOT_FOUND'
                }
            });
        }
        
        res.json({
            success: true,
            data: user
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: {
                message: 'Error fetching user',
                code: 'SERVER_ERROR',
                details: error.message
            }
        });
    }
};

// Ban user (Admin only)
export const banUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { reason } = req.body;
        
        // Prevent admin from banning themselves
        if (id === req.user._id.toString()) {
            return res.status(400).json({
                success: false,
                error: {
                    message: 'You cannot ban yourself',
                    code: 'CANNOT_BAN_SELF'
                }
            });
        }
        
        const user = await User.findById(id);
        
        if (!user) {
            return res.status(404).json({
                success: false,
                error: {
                    message: 'User not found',
                    code: 'USER_NOT_FOUND'
                }
            });
        }
        
        // Check if user is already banned
        if (user.isBanned) {
            return res.status(400).json({
                success: false,
                error: {
                    message: 'User is already banned',
                    code: 'USER_ALREADY_BANNED'
                }
            });
        }
        
        // Ban the user
        user.isBanned = true;
        user.bannedAt = new Date();
        user.bannedBy = req.user._id;
        user.banReason = reason || 'No reason provided';
        
        await user.save();
        
        res.json({
            success: true,
            message: 'User banned successfully',
            data: {
                id: user._id,
                username: user.username,
                isBanned: user.isBanned,
                bannedAt: user.bannedAt,
                banReason: user.banReason
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: {
                message: 'Error banning user',
                code: 'SERVER_ERROR',
                details: error.message
            }
        });
    }
};

// Unban user (Admin only)
export const unbanUser = async (req, res) => {
    try {
        const { id } = req.params;
        
        const user = await User.findById(id);
        
        if (!user) {
            return res.status(404).json({
                success: false,
                error: {
                    message: 'User not found',
                    code: 'USER_NOT_FOUND'
                }
            });
        }
        
        // Check if user is not banned
        if (!user.isBanned) {
            return res.status(400).json({
                success: false,
                error: {
                    message: 'User is not banned',
                    code: 'USER_NOT_BANNED'
                }
            });
        }
        
        // Unban the user
        user.isBanned = false;
        user.bannedAt = undefined;
        user.bannedBy = undefined;
        user.banReason = undefined;
        
        await user.save();
        
        res.json({
            success: true,
            message: 'User unbanned successfully',
            data: {
                id: user._id,
                username: user.username,
                isBanned: user.isBanned
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: {
                message: 'Error unbanning user',
                code: 'SERVER_ERROR',
                details: error.message
            }
        });
    }
};

// Delete user (Admin only)
export const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        
        // Prevent admin from deleting themselves
        if (id === req.user._id.toString()) {
            return res.status(400).json({
                success: false,
                error: {
                    message: 'You cannot delete yourself',
                    code: 'CANNOT_DELETE_SELF'
                }
            });
        }
        
        const user = await User.findById(id);
        
        if (!user) {
            return res.status(404).json({
                success: false,
                error: {
                    message: 'User not found',
                    code: 'USER_NOT_FOUND'
                }
            });
        }
        
        await User.findByIdAndDelete(id);
        
        res.json({
            success: true,
            message: 'User deleted successfully',
            data: {
                id: user._id,
                username: user.username
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: {
                message: 'Error deleting user',
                code: 'SERVER_ERROR',
                details: error.message
            }
        });
    }
};

// Get user statistics (Admin only)
export const getUserStats = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalAdmins = await User.countDocuments({ role: 'Admin' });
        const totalFaculty = await User.countDocuments({ role: 'Faculty' });
        const bannedUsers = await User.countDocuments({ isBanned: true });
        const activeUsers = await User.countDocuments({ isBanned: false });
        
        // Get recent users (last 7 days)
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        const recentUsers = await User.countDocuments({ 
            createdAt: { $gte: sevenDaysAgo } 
        });
        
        res.json({
            success: true,
            data: {
                totalUsers,
                totalAdmins,
                totalFaculty,
                bannedUsers,
                activeUsers,
                recentUsers
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: {
                message: 'Error fetching user statistics',
                code: 'SERVER_ERROR',
                details: error.message
            }
        });
    }
};
