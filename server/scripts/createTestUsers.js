import dotenv from 'dotenv';
import mongoose from 'mongoose';
import User from '../models/User.js';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables from parent directory
dotenv.config({ path: join(__dirname, '..', '.env') });

const createTestUsers = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        // Test users to create
        const testUsers = [
            {
                username: 'admin',
                email: 'admin@example.com',
                password: 'Admin@123',
                role: 'Admin'
            },
            {
                username: 'faculty',
                email: 'faculty@example.com',
                password: 'Faculty@123',
                role: 'Faculty'
            }
        ];

        for (const userData of testUsers) {
            // Check if user already exists
            const existingUser = await User.findOne({ email: userData.email });
            
            if (existingUser) {
                console.log(`User ${userData.email} already exists, skipping...`);
                continue;
            }

            // Create new user
            const user = new User(userData);
            await user.save();
            console.log(`✓ Created ${userData.role} user: ${userData.email} (password: ${userData.password})`);
        }

        console.log('\n✓ Test users created successfully!');
        console.log('\nYou can now login with:');
        console.log('Admin - email: admin@example.com, password: Admin@123');
        console.log('Faculty - email: faculty@example.com, password: Faculty@123');

    } catch (error) {
        console.error('Error creating test users:', error);
    } finally {
        await mongoose.connection.close();
        console.log('\nDatabase connection closed');
    }
};

createTestUsers();
