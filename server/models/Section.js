import mongoose from 'mongoose';

const sectionSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Section name is required'],
        trim: true
    },
    department: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Department',
        required: [true, 'Department reference is required']
    },
    capacity: {
        type: Number,
        default: 60,
        min: [1, 'Capacity must be at least 1']
    },
    currentStrength: {
        type: Number,
        default: 0,
        min: [0, 'Current strength cannot be negative']
    }
}, {
    timestamps: true
});

// Add compound index for department and name to ensure section uniqueness within department
sectionSchema.index({ department: 1, name: 1 }, { unique: true });

// Validation to ensure section name is unique within a department
sectionSchema.pre('save', async function(next) {
    if (this.isNew || this.isModified('name') || this.isModified('department')) {
        const existingSection = await mongoose.model('Section').findOne({
            department: this.department,
            name: this.name,
            _id: { $ne: this._id }
        });
        
        if (existingSection) {
            const error = new Error('Section name must be unique within the department');
            return next(error);
        }
    }
    next();
});

const Section = mongoose.model('Section', sectionSchema);

export default Section;
