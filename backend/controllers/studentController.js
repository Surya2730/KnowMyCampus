const asyncHandler = require('express-async-handler');
const Student = require('../models/Student');
const User = require('../models/User');

// @desc    Get student profile
// @route   GET /api/students/profile
// @access  Private
const getStudentProfile = asyncHandler(async (req, res) => {
    const student = await Student.findOne({ user: req.user._id }).populate('user', 'name email role');

    if (student) {
        res.json(student);
    } else {
        res.status(404);
        throw new Error('Student profile not found');
    }
});

// @desc    Update student profile
// @route   PUT /api/students/profile
// @access  Private
const updateStudentProfile = asyncHandler(async (req, res) => {
    res.status(403);
    throw new Error('Direct editing of academic profiles is disabled for students. Please contact an administrator.');
});

// @desc    Get all students (Admin Only)
// @route   GET /api/students
// @access  Private/Admin
const getAllStudents = asyncHandler(async (req, res) => {
    const students = await Student.find({}).populate('user', 'name email role');
    res.json(students);
});

// @desc    Get student by ID (Admin Only)
// @route   GET /api/students/:id
// @access  Private/Admin
const getStudentById = asyncHandler(async (req, res) => {
    const student = await Student.findById(req.params.id).populate('user', 'name email role');
    if (student) {
        res.json(student);
    } else {
        res.status(404);
        throw new Error('Student not found');
    }
});

// @desc    Update student by ID (Admin Only)
// @route   PUT /api/students/:id
// @access  Private/Admin
const updateStudentById = asyncHandler(async (req, res) => {
    const student = await Student.findById(req.params.id);

    if (student) {
        student.rollNumber = req.body.rollNumber || student.rollNumber;
        student.department = req.body.department || student.department;
        student.year = req.body.year || student.year;
        student.cgpa = req.body.cgpa !== undefined ? req.body.cgpa : student.cgpa;
        student.backlogs = req.body.backlogs !== undefined ? req.body.backlogs : student.backlogs;
        student.arrears = req.body.arrears !== undefined ? req.body.arrears : student.arrears;

        const updatedStudent = await student.save();
        res.json(updatedStudent);
    } else {
        res.status(404);
        throw new Error('Student not found');
    }
});

module.exports = {
    getStudentProfile,
    updateStudentProfile,
    getAllStudents,
    getStudentById,
    updateStudentById,
};
