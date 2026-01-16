const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    venue: {
        type: String,
        required: true,
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
        eligibleDepartments: [{
            type: String,
        }],
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model('Event', eventSchema);
