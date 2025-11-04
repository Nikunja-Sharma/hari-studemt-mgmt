import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Username is required'],
        trim: true,
        minlength: [3, 'Username must be at least 3 characters long']
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        trim: true,
        lowercase: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [8, 'Password must be at least 8 characters long']
    },
    role: {
        type: String,
        enum: ['Admin', 'Faculty'],
        default: 'Faculty',
        required: true
    },
    // Profile information
    profile: {
        firstName: {
            type: String,
            trim: true
        },
        lastName: {
            type: String,
            trim: true
        },
        contact: {
            type: String,
            trim: true,
            match: [/^\d{10}$/, 'Contact must be 10 digits']
        },
        profilePicture: {
            type: String, // URL or base64
            trim: true
        },
        dateOfBirth: {
            type: Date
        },
        address: {
            type: String,
            trim: true
        }
    },
    // User preferences
    preferences: {
        theme: {
            type: String,
            enum: ['light', 'dark'],
            default: 'light'
        },
        language: {
            type: String,
            default: 'en'
        },
        dateFormat: {
            type: String,
            default: 'MM/DD/YYYY'
        },
        itemsPerPage: {
            type: Number,
            default: 10,
            min: 5,
            max: 100
        },
        emailNotifications: {
            type: Boolean,
            default: true
        }
    },
    // Security settings
    security: {
        passwordChangedAt: {
            type: Date
        },
        passwordHistory: [{
            type: String
        }],
        failedLoginAttempts: {
            type: Number,
            default: 0
        },
        lockedUntil: {
            type: Date
        },
        twoFactorEnabled: {
            type: Boolean,
            default: false
        },
        twoFactorSecret: {
            type: String
        }
    },
    lastLogin: {
        type: Date
    },
    // Account status
    isBanned: {
        type: Boolean,
        default: false
    },
    bannedAt: {
        type: Date
    },
    bannedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    banReason: {
        type: String,
        trim: true
    }
}, {
    timestamps: true
});

// Add unique indexes (removed 'unique: true' from schema to avoid duplicate index warning)
userSchema.index({ username: 1 }, { unique: true });
userSchema.index({ email: 1 }, { unique: true });

// Hash password before saving using bcrypt
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    
    try {
        // Store old password in history before hashing new one
        if (this.isNew === false && this.password) {
            // Initialize security object if it doesn't exist
            if (!this.security) {
                this.security = {};
            }
            
            // Initialize password history if it doesn't exist
            if (!this.security.passwordHistory) {
                this.security.passwordHistory = [];
            }
            
            // Add current password to history (before it gets hashed)
            // Keep only last 5 passwords
            const currentPassword = this._original?.password || this.password;
            if (currentPassword && !this.security.passwordHistory.includes(currentPassword)) {
                this.security.passwordHistory.unshift(currentPassword);
                if (this.security.passwordHistory.length > 5) {
                    this.security.passwordHistory = this.security.passwordHistory.slice(0, 5);
                }
            }
            
            // Update password changed timestamp
            this.security.passwordChangedAt = new Date();
        }
        
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

// Method to check if password was used before
userSchema.methods.isPasswordInHistory = async function(candidatePassword) {
    if (!this.security?.passwordHistory || this.security.passwordHistory.length === 0) {
        return false;
    }
    
    for (const oldPassword of this.security.passwordHistory) {
        const isMatch = await bcrypt.compare(candidatePassword, oldPassword);
        if (isMatch) {
            return true;
        }
    }
    return false;
};

// Method to check if account is locked
userSchema.methods.isAccountLocked = function() {
    if (!this.security?.lockedUntil) {
        return false;
    }
    return this.security.lockedUntil > new Date();
};

// Method to increment failed login attempts
userSchema.methods.incrementFailedAttempts = async function() {
    // Initialize security object if it doesn't exist
    if (!this.security) {
        this.security = {};
    }
    
    this.security.failedLoginAttempts = (this.security.failedLoginAttempts || 0) + 1;
    
    // Lock account after 5 failed attempts for 30 minutes
    if (this.security.failedLoginAttempts >= 5) {
        this.security.lockedUntil = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes
    }
    
    await this.save();
};

// Method to reset failed login attempts
userSchema.methods.resetFailedAttempts = async function() {
    if (!this.security) {
        this.security = {};
    }
    
    this.security.failedLoginAttempts = 0;
    this.security.lockedUntil = undefined;
    await this.save();
};

// Method to update last login
userSchema.methods.updateLastLogin = async function() {
    this.lastLogin = new Date();
    await this.save();
};

const User = mongoose.model('User', userSchema);

export default User; 