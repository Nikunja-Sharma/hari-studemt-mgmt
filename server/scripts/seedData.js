import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Department from '../models/Department.js';
import Section from '../models/Section.js';
import Student from '../models/Student.js';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '..', '.env') });

const seedData = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        // Clear existing data
        await Student.deleteMany({});
        await Section.deleteMany({});
        await Department.deleteMany({});
        console.log('Cleared existing data');

        // Create Departments
        const departments = await Department.insertMany([
            {
                name: 'Computer Science',
                code: 'CS',
                description: 'Department of Computer Science and Engineering'
            },
            {
                name: 'Electronics',
                code: 'EC',
                description: 'Department of Electronics and Communication'
            },
            {
                name: 'Mechanical',
                code: 'ME',
                description: 'Department of Mechanical Engineering'
            },
            {
                name: 'Civil',
                code: 'CE',
                description: 'Department of Civil Engineering'
            }
        ]);
        console.log(`✓ Created ${departments.length} departments`);

        // Create Sections for each department
        const sections = [];
        for (const dept of departments) {
            const deptSections = await Section.insertMany([
                {
                    name: 'A',
                    department: dept._id,
                    capacity: 60,
                    currentStrength: 0
                },
                {
                    name: 'B',
                    department: dept._id,
                    capacity: 60,
                    currentStrength: 0
                }
            ]);
            sections.push(...deptSections);
        }
        console.log(`✓ Created ${sections.length} sections`);

        // Create Students
        const students = [];
        let rollNumberCounter = 1001;

        for (const dept of departments) {
            const deptSections = sections.filter(s => s.department.toString() === dept._id.toString());
            
            for (const section of deptSections) {
                // Create 10 students per section
                for (let i = 1; i <= 10; i++) {
                    students.push({
                        name: `Student ${rollNumberCounter}`,
                        rollNumber: `${dept.code}${rollNumberCounter}`,
                        email: `student${rollNumberCounter}@example.com`,
                        contact: `98${String(rollNumberCounter).padStart(8, '0')}`,
                        department: dept._id,
                        section: section._id
                    });
                    rollNumberCounter++;
                }
            }
        }

        await Student.insertMany(students);
        console.log(`✓ Created ${students.length} students`);

        // Update section strengths
        for (const section of sections) {
            const count = students.filter(s => s.section.toString() === section._id.toString()).length;
            await Section.findByIdAndUpdate(section._id, { currentStrength: count });
        }
        console.log('✓ Updated section strengths');

        console.log('\n✅ Database seeded successfully!');
        console.log('\nSummary:');
        console.log(`- Departments: ${departments.length}`);
        console.log(`- Sections: ${sections.length}`);
        console.log(`- Students: ${students.length}`);

    } catch (error) {
        console.error('Error seeding database:', error);
    } finally {
        await mongoose.connection.close();
        console.log('\nDatabase connection closed');
    }
};

seedData();
