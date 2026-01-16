const express = require('express');
const router = express.Router();
const {
    getEvents,
    createEvent,
    updateEvent,
    deleteEvent,
    checkEventEligibility,
} = require('../controllers/eventController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/')
    .get(protect, getEvents)
    .post(protect, admin, createEvent);

router.route('/:id')
    .put(protect, admin, updateEvent)
    .delete(protect, admin, deleteEvent);

router.get('/eligibility/:id', protect, checkEventEligibility);

module.exports = router;
