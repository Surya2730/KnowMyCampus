const express = require('express');
const router = express.Router();
const {
    getCompanies,
    createCompany,
    updateCompany,
    deleteCompany,
    checkCompanyEligibility,
} = require('../controllers/companyController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/')
    .get(protect, getCompanies)
    .post(protect, admin, createCompany);

router.route('/:id')
    .put(protect, admin, updateCompany)
    .delete(protect, admin, deleteCompany);

router.get('/eligibility/:id', protect, checkCompanyEligibility);

module.exports = router;
