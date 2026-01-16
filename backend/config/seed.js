const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const Student = require('../models/Student');
const Announcement = require('../models/Announcement');
const Event = require('../models/Event');
const Company = require('../models/Company');
const Post = require('../models/Post');

dotenv.config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected for seeding');
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

const seedData = async () => {
    try {
        await User.deleteMany();
        await Student.deleteMany();
        await Announcement.deleteMany();
        await Event.deleteMany();
        await Company.deleteMany();
        await Post.deleteMany();

        // Create Admin
        const admin = await User.create({
            name: 'College Admin',
            email: 'admin@college.edu',
            password: 'adminpassword',
            role: 'Admin',
        });

        // Create Students
        const student1User = await User.create({
            name: 'John Doe',
            email: 'john@student.edu',
            password: 'password123',
            role: 'Student',
        });

        await Student.create({
            user: student1User._id,
            rollNumber: 'CS001',
            department: 'Computer Science',
            year: 3,
            cgpa: 8.5,
            backlogs: 0,
            arrears: 0,
        });

        const student2User = await User.create({
            name: 'Jane Smith',
            email: 'jane@student.edu',
            password: 'password123',
            role: 'Student',
        });

        await Student.create({
            user: student2User._id,
            rollNumber: 'CS002',
            department: 'Computer Science',
            year: 4,
            cgpa: 6.5,
            backlogs: 2,
            arrears: 1,
        });

        // Announcements
        await Announcement.create([
            { title: 'Welcome to KnowMyCampus', content: 'Explore the new college portal for events and placements.', type: 'General' },
            { title: 'Placement Drive: TechCorp', content: 'TechCorp is visiting for 2024 graduates on 15th Feb.', type: 'Placement' },
        ]);

        // Events
        await Event.create({
            title: 'Annual Tech Symposium',
            description: 'A day of innovation and technical talks.',
            venue: 'Main Auditorium',
            date: new Date('2026-03-10'),
            eligibility: {
                minCgpa: 6.0,
                maxBacklogs: 2,
                eligibleDepartments: ['Computer Science', 'Electronics'],
            },
        });

        // Companies
        await Company.create([
            {
                name: 'TechCorp',
                description: 'Leading software solutions provider.',
                role: 'Software Engineer',
                salary: '12 LPA',
                date: new Date('2026-02-15'),
                eligibility: {
                    minCgpa: 7.5,
                    maxBacklogs: 0,
                    arrearsAllowed: false,
                    eligibleDepartments: ['Computer Science'],
                },
            },
            {
                name: 'DevSystems',
                description: 'Cloud infrastructure experts.',
                role: 'DevOps Intern',
                salary: '6 LPA',
                date: new Date('2026-02-20'),
                eligibility: {
                    minCgpa: 6.5,
                    maxBacklogs: 3,
                    arrearsAllowed: true,
                    eligibleDepartments: ['Computer Science', 'Information Technology'],
                },
            },
        ]);

        // Forum Posts
        await Post.create({
            title: 'How to prepare for TechCorp?',
            content: 'I want to know the interview process for TechCorp.',
            author: student1User._id,
            category: 'Placements',
            replies: [
                { content: 'Focus on Data Structures and Algorithms.', author: admin._id },
            ],
        });

        console.log('Data Seeded Successfully');
        process.exit();
    } catch (error) {
        console.error(`Error with seeding: ${error.message}`);
        process.exit(1);
    }
};

connectDB().then(seedData);
