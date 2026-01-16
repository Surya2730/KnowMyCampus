const asyncHandler = require('express-async-handler');
const Event = require('../models/Event');
const Student = require('../models/Student');

// @desc    Get all events
// @route   GET /api/events
// @access  Private
const getEvents = asyncHandler(async (req, res) => {
    const events = await Event.find({}).sort({ date: 1 });
    res.json(events);
});

// @desc    Create an event
// @route   POST /api/events
// @access  Private/Admin
const createEvent = asyncHandler(async (req, res) => {
    const { title, description, venue, date, eligibility } = req.body;

    const event = await Event.create({
        title,
        description,
        venue,
        date,
        eligibility,
    });

    if (event) {
        res.status(201).json(event);
    } else {
        res.status(400);
        throw new Error('Invalid event data');
    }
});

// @desc    Update an event
// @route   PUT /api/events/:id
// @access  Private/Admin
const updateEvent = asyncHandler(async (req, res) => {
    const { title, description, venue, date, eligibility } = req.body;
    const event = await Event.findById(req.params.id);

    if (event) {
        event.title = title || event.title;
        event.description = description || event.description;
        event.venue = venue || event.venue;
        event.date = date || event.date;
        event.eligibility = eligibility || event.eligibility;

        const updatedEvent = await event.save();
        res.json(updatedEvent);
    } else {
        res.status(404);
        throw new Error('Event not found');
    }
});

// @desc    Delete an event
// @route   DELETE /api/events/:id
// @access  Private/Admin
const deleteEvent = asyncHandler(async (req, res) => {
    const event = await Event.findById(req.params.id);

    if (event) {
        await event.deleteOne();
        res.json({ message: 'Event removed' });
    } else {
        res.status(404);
        throw new Error('Event not found');
    }
});

// @desc    Check event eligibility
// @route   GET /api/events/eligibility/:id
// @access  Private
const checkEventEligibility = asyncHandler(async (req, res) => {
    const event = await Event.findById(req.params.id);
    const student = await Student.findOne({ user: req.user._id });

    if (!event || !student) {
        res.status(404);
        throw new Error('Event or Student not found');
    }

    const { minCgpa, maxBacklogs, eligibleDepartments } = event.eligibility;

    let isEligible = true;
    let reasons = [];

    if (student.cgpa < minCgpa) {
        isEligible = false;
        reasons.push(`Minimum CGPA required: ${minCgpa}`);
    }

    if (student.backlogs > maxBacklogs) {
        isEligible = false;
        reasons.push(`Maximum backlogs allowed: ${maxBacklogs}`);
    }

    if (eligibleDepartments.length > 0 && !eligibleDepartments.includes(student.department)) {
        isEligible = false;
        reasons.push(`Eligible departments: ${eligibleDepartments.join(', ')}`);
    }

    res.json({ isEligible, reasons });
});

module.exports = {
    getEvents,
    createEvent,
    updateEvent,
    deleteEvent,
    checkEventEligibility,
};
