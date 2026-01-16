const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        required: true,
    },
    salary: {
        type: String,
    },
    date: {
        type: Date,
        required: true,
    },
    eligibility: {
        minCgpa: {
            type: Number,
            default: 0,
        },
        maxBacklogs: {
            type: Number,
            default: 10,
        },
        arrearsAllowed: {
            type: Boolean,
            default: true,
        },
        eligibleDepartments: [{
            type: String,
        }],
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model('Company', companySchema);
