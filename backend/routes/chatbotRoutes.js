const express = require('express');
const router = express.Router();
const { queryChatbot } = require('../controllers/chatbotController');
const { protect } = require('../middleware/authMiddleware');

router.post('/query', protect, queryChatbot);

module.exports = router;
