const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    rollNumber: {
        type: String,
        required: true,
        unique: true,
    },
    department: {
        type: String,
        required: true,
    },
    year: {
        type: Number,
        required: true,
    },
    cgpa: {
        type: Number,
        required: true,
    },
    backlogs: {
        type: Number,
        default: 0,
    },
    arrears: {
        type: Number,
        default: 0,
    },
    semesterResults: [{
        type: Number
    }],
}, {
    timestamps: true,
});

module.exports = mongoose.model('Student', studentSchema);
