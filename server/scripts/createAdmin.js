import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Load environment variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '..', '.env') });

const createAdminUser = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/student_management_db');
        console.log('Connected to MongoDB');

        // Check if admin already exists
        const existingAdmin = await User.findOne({ email: 'admin@example.com' });
        if (existingAdmin) {
            console.log('Admin user already exists!');
            console.log('Email:', existingAdmin.email);
            console.log('Username:', existingAdmin.username);
            process.exit(0);
        }

        // Create admin user
        const adminUser = new User({
            username: 'admin',
            email: 'admin@example.com',
            password: 'Admin@123', // This will be hashed by the pre-save middleware
            role: 'Admin'
        });

        await adminUser.save();

        console.log('\n✅ Admin user created successfully!');
        console.log('-----------------------------------');
        console.log('Email: admin@example.com');
        console.log('Password: Admin@123');
        console.log('Role: Admin');
        console.log('-----------------------------------');
        console.log('\n⚠️  Please change the password after first login!');
        console.log('\nYou can now login at: http://localhost:5173/login\n');

        process.exit(0);
    } catch (error) {
        console.error('Error creating admin user:', error.message);
        process.exit(1);
    }
};

createAdminUser();
