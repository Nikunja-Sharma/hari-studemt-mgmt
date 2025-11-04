import User from '../models/User.js';

// Get current user profile
export const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.userId).select('-password -security.passwordHistory -security.twoFactorSecret');
        
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
            user
        });
    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({ 
            success: false,
            error: {
                message: 'Server error',
                code: 'SERVER_ERROR',
                details: error.message
            }
        });
    }
};

// Update user profile
export const updateProfile = async (req, res) => {
    try {
        const { profile } = req.body;
        
        // Validate profile data
        if (profile) {
            if (profile.contact && !/^\d{10}$/.test(profile.contact)) {
                return res.status(400).json({ 
                    success: false,
                    error: {
                        message: 'Contact must be 10 digits',
                        code: 'INVALID_CONTACT'
                    }
                });
            }
        }

        const user = await User.findById(req.userId);
        
        if (!user) {
            return res.status(404).json({ 
                success: false,
                error: {
                    message: 'User not found',
                    code: 'USER_NOT_FOUND'
                }
            });
        }

        // Update profile fields
        if (profile) {
            user.profile = {
                ...user.profile,
                ...profile
            };
        }

        await user.save();

        // Return user without sensitive data
        const updatedUser = await User.findById(user._id).select('-password -security.passwordHistory -security.twoFactorSecret');
        
        res.json({ 
            success: true,
            message: 'Profile updated successfully',
            user: updatedUser
        });
    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({ 
            success: false,
            error: {
                message: 'Server error',
                code: 'SERVER_ERROR',
                details: error.message
            }
        });
    }
};

// Get user preferences
export const getPreferences = async (req, res) => {
    try {
        const user = await User.findById(req.userId).select('preferences');
        
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
            preferences: user.preferences || {}
        });
    } catch (error) {
        console.error('Get preferences error:', error);
        res.status(500).json({ 
            success: false,
            error: {
                message: 'Server error',
                code: 'SERVER_ERROR',
                details: error.message
            }
        });
    }
};

// Update user preferences
export const updatePreferences = async (req, res) => {
    try {
        const { preferences } = req.body;
        
        // Validate preferences
        if (preferences) {
            if (preferences.theme && !['light', 'dark'].includes(preferences.theme)) {
                return res.status(400).json({ 
                    success: false,
                    error: {
                        message: 'Invalid theme value',
                        code: 'INVALID_THEME'
                    }
                });
            }
            
            if (preferences.itemsPerPage && (preferences.itemsPerPage < 5 || preferences.itemsPerPage > 100)) {
                return res.status(400).json({ 
                    success: false,
                    error: {
                        message: 'Items per page must be between 5 and 100',
                        code: 'INVALID_ITEMS_PER_PAGE'
                    }
                });
            }
        }

        const user = await User.findById(req.userId);
        
        if (!user) {
            return res.status(404).json({ 
                success: false,
                error: {
                    message: 'User not found',
                    code: 'USER_NOT_FOUND'
                }
            });
        }

        // Update preferences
        user.preferences = {
            ...user.preferences,
            ...preferences
        };

        await user.save();

        res.json({ 
            success: true,
            message: 'Preferences updated successfully',
            preferences: user.preferences
        });
    } catch (error) {
        console.error('Update preferences error:', error);
        res.status(500).json({ 
            success: false,
            error: {
                message: 'Server error',
                code: 'SERVER_ERROR',
                details: error.message
            }
        });
    }
};

// Change password
export const changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        
        // Validate input
        if (!currentPassword || !newPassword) {
            return res.status(400).json({ 
                success: false,
                error: {
                    message: 'Current password and new password are required',
                    code: 'MISSING_PASSWORDS'
                }
            });
        }

        if (newPassword.length < 8) {
            return res.status(400).json({ 
                success: false,
                error: {
                    message: 'New password must be at least 8 characters long',
                    code: 'PASSWORD_TOO_SHORT'
                }
            });
        }

        const user = await User.findById(req.userId);
        
        if (!user) {
            return res.status(404).json({ 
                success: false,
                error: {
                    message: 'User not found',
                    code: 'USER_NOT_FOUND'
                }
            });
        }

        // Verify current password
        const isMatch = await user.comparePassword(currentPassword);
        if (!isMatch) {
            return res.status(400).json({ 
                success: false,
                error: {
                    message: 'Current password is incorrect',
                    code: 'INCORRECT_PASSWORD'
                }
            });
        }

        // Check if new password is in history
        if (user.isPasswordInHistory) {
            const isInHistory = await user.isPasswordInHistory(newPassword);
            if (isInHistory) {
                return res.status(400).json({ 
                    success: false,
                    error: {
                        message: 'Cannot reuse a recent password. Please choose a different password.',
                        code: 'PASSWORD_IN_HISTORY'
                    }
                });
            }
        }

        // Update password
        user.password = newPassword;
        await user.save();

        res.json({ 
            success: true,
            message: 'Password changed successfully' 
        });
    } catch (error) {
        console.error('Change password error:', error);
        res.status(500).json({ 
            success: false,
            error: {
                message: 'Server error',
                code: 'SERVER_ERROR',
                details: error.message
            }
        });
    }
};

// Upload profile picture
export const uploadAvatar = async (req, res) => {
    try {
        const { profilePicture } = req.body;
        
        if (!profilePicture) {
            return res.status(400).json({ 
                success: false,
                error: {
                    message: 'Profile picture data is required',
                    code: 'MISSING_PROFILE_PICTURE'
                }
            });
        }

        const user = await User.findById(req.userId);
        
        if (!user) {
            return res.status(404).json({ 
                success: false,
                error: {
                    message: 'User not found',
                    code: 'USER_NOT_FOUND'
                }
            });
        }

        // Initialize profile if it doesn't exist
        if (!user.profile) {
            user.profile = {};
        }

        // Update profile picture
        user.profile.profilePicture = profilePicture;
        await user.save();

        res.json({ 
            success: true,
            message: 'Profile picture updated successfully',
            profilePicture: user.profile.profilePicture
        });
    } catch (error) {
        console.error('Upload avatar error:', error);
        res.status(500).json({ 
            success: false,
            error: {
                message: 'Server error',
                code: 'SERVER_ERROR',
                details: error.message
            }
        });
    }
};
