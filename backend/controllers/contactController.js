const asyncHandler = require('express-async-handler');

// @desc    Get college contact details
// @route   GET /api/contact
// @access  Private
const getContactDetails = asyncHandler(async (req, res) => {
    res.json({
        collegeName: 'BANNARI AMMAN INSTITUTE OF TECHNOLOGY',
        address: 'Sathy - Bhavani State Highway, Alathukombai, Post, Sathyamangalam, Tamil Nadu 638401',
        email: 'stayahead@bitsathy.ac.in',
        phone: '+91 94872 - 64923',
        website: 'www.bitsathy.ac.in',
        officeHours: '9:00 AM - 5:00 PM (Mon-Sat)',
    });
});

module.exports = { getContactDetails };
