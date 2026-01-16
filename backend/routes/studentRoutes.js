const express = require('express');
const router = express.Router();
const {
    getStudentProfile,
    updateStudentProfile,
    getAllStudents,
    getStudentById,
    updateStudentById,
} = require('../controllers/studentController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/profile')
    .get(protect, getStudentProfile)
    .put(protect, updateStudentProfile);

router.route('/')
    .get(protect, admin, getAllStudents);

router.route('/:id')
    .get(protect, admin, getStudentById)
    .put(protect, admin, updateStudentById);

module.exports = router;
