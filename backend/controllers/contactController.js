const asyncHandler = require('express-async-handler');

// @desc    Get college contact details
// @route   GET /api/contact
// @access  Private
const getContactDetails = asyncHandler(async (req, res) => {
    res.json({
        collegeName: 'KnowMyCampus Institute of Technology',
        address: '123 Academic Lane, Knowledge City, State - 600001',
        email: 'info@knowmycampus.edu',
        phone: '+91 98765 43210',
        website: 'www.knowmycampus.edu',
        officeHours: '9:00 AM - 5:00 PM (Mon-Fri)',
    });
});

module.exports = { getContactDetails };
