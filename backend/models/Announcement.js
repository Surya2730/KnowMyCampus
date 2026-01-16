const mongoose = require('mongoose');

const announcementSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        enum: ['General', 'Event', 'Placement', 'Academic'],
        default: 'General',
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model('Announcement', announcementSchema);
