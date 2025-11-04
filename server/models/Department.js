import mongoose from 'mongoose';

const departmentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Department name is required'],
        trim: true
    },
    code: {
        type: String,
        required: [true, 'Department code is required'],
        trim: true,
        uppercase: true
    },
    description: {
        type: String,
        trim: true
    }
}, {
    timestamps: true
});

// Add unique indexes (removed 'unique: true' from schema to avoid duplicate index warning)
departmentSchema.index({ name: 1 }, { unique: true });
departmentSchema.index({ code: 1 }, { unique: true });

const Department = mongoose.model('Department', departmentSchema);

export default Department;
