const express = require('express');
const router = express.Router();
const { authUser, googleLogin } = require('../controllers/authController');

router.post('/login', authUser);
router.post('/google', googleLogin);

module.exports = router;
