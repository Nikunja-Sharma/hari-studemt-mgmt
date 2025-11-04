import mongoose from 'mongoose';

const studentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Student name is required'],
        trim: true
    },
    rollNumber: {
        type: String,
        required: [true, 'Roll number is required'],
        trim: true,
        uppercase: true
    },
    department: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Department',
        required: [true, 'Department is required']
    },
    section: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Section',
        required: [true, 'Section is required']
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        trim: true,
        lowercase: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
    },
    contact: {
        type: String,
        required: [true, 'Contact number is required'],
        trim: true,
        match: [/^[0-9]{10}$/, 'Please enter a valid 10-digit contact number']
    }
}, {
    timestamps: true
});

// Add indexes (removed 'unique: true' from schema to avoid duplicate index warning)
studentSchema.index({ rollNumber: 1 }, { unique: true });
studentSchema.index({ email: 1 }, { unique: true });
studentSchema.index({ department: 1 });
studentSchema.index({ section: 1 });

// Method to populate department and section references
studentSchema.methods.populateReferences = async function() {
    await this.populate('department');
    await this.populate('section');
    return this;
};

// Static method to find students with populated references
studentSchema.statics.findWithReferences = function(query = {}) {
    return this.find(query)
        .populate('department')
        .populate('section');
};

// Static method to find one student with populated references
studentSchema.statics.findOneWithReferences = function(query) {
    return this.findOne(query)
        .populate('department')
        .populate('section');
};

// Static method to find by ID with populated references
studentSchema.statics.findByIdWithReferences = function(id) {
    return this.findById(id)
        .populate('department')
        .populate('section');
};

const Student = mongoose.model('Student', studentSchema);

export default Student;
