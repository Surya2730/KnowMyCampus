const express = require('express');
const router = express.Router();
const { getContactDetails } = require('../controllers/contactController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getContactDetails);

module.exports = router;
