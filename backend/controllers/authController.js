const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Student = require('../models/Student');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// ... existing generateToken function

// @desc    Auth user with Google
// @route   POST /api/auth/google
// @access  Public
const googleLogin = asyncHandler(async (req, res) => {
    const { token } = req.body;
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID,
    });

    const { name, email, picture } = ticket.getPayload();
    let user = await User.findOne({ email });

    const isAdmin = email === process.env.ADMIN_EMAIL;

    if (!user) {
        user = await User.create({
            name,
            email,
            password: Math.random().toString(36).slice(-8), // Placeholder password for Google users
            role: isAdmin ? 'Admin' : 'Student',
        });
    }

    // Role check (in case Admin email changes or was registered as Student)
    if (isAdmin && user.role !== 'Admin') {
        user.role = 'Admin';
        await user.save();
    }

    if (user.role === 'Student') {
        let student = await Student.findOne({ user: user._id });
        if (!student) {
            await Student.create({
                user: user._id,
                rollNumber: 'NOT_SET',
                department: 'NOT_SET',
                year: 1,
                cgpa: 0,
                backlogs: 0,
                arrears: 0,
            });
        }
    }

    res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
    });
});

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
const authUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user._id),
        });
    } else {
        res.status(401);
        throw new Error('Invalid email or password');
    }
});

module.exports = { googleLogin, authUser };
