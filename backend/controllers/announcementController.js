const asyncHandler = require('express-async-handler');
const Announcement = require('../models/Announcement');

// @desc    Get all announcements
// @route   GET /api/announcements
// @access  Public
const getAnnouncements = asyncHandler(async (req, res) => {
    const announcements = await Announcement.find({}).sort({ createdAt: -1 });
    res.json(announcements);
});

// @desc    Create an announcement
// @route   POST /api/announcements
// @access  Private/Admin
const createAnnouncement = asyncHandler(async (req, res) => {
    const { title, content, type } = req.body;

    const announcement = await Announcement.create({
        title,
        content,
        type,
    });

    if (announcement) {
        res.status(201).json(announcement);
    } else {
        res.status(400);
        throw new Error('Invalid announcement data');
    }
});

// @desc    Update an announcement
// @route   PUT /api/announcements/:id
// @access  Private/Admin
const updateAnnouncement = asyncHandler(async (req, res) => {
    const { title, content, type } = req.body;
    const announcement = await Announcement.findById(req.params.id);

    if (announcement) {
        announcement.title = title || announcement.title;
        announcement.content = content || announcement.content;
        announcement.type = type || announcement.type;

        const updatedAnnouncement = await announcement.save();
        res.json(updatedAnnouncement);
    } else {
        res.status(404);
        throw new Error('Announcement not found');
    }
});

// @desc    Delete an announcement
// @route   DELETE /api/announcements/:id
// @access  Private/Admin
const deleteAnnouncement = asyncHandler(async (req, res) => {
    const announcement = await Announcement.findById(req.params.id);

    if (announcement) {
        await announcement.deleteOne();
        res.json({ message: 'Announcement removed' });
    } else {
        res.status(404);
        throw new Error('Announcement not found');
    }
});

module.exports = {
    getAnnouncements,
    createAnnouncement,
    updateAnnouncement,
    deleteAnnouncement,
};
