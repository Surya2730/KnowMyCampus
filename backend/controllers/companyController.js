const asyncHandler = require('express-async-handler');
const Company = require('../models/Company');
const Student = require('../models/Student');

// @desc    Get all companies
// @route   GET /api/companies
// @access  Private
const getCompanies = asyncHandler(async (req, res) => {
    const companies = await Company.find({}).sort({ date: 1 });
    res.json(companies);
});

// @desc    Create a company
// @route   POST /api/companies
// @access  Private/Admin
const createCompany = asyncHandler(async (req, res) => {
    const { name, description, role, salary, date, eligibility } = req.body;

    const company = await Company.create({
        name,
        description,
        role,
        salary,
        date,
        eligibility,
    });

    if (company) {
        res.status(201).json(company);
    } else {
        res.status(400);
        throw new Error('Invalid company data');
    }
});

// @desc    Update a company
// @route   PUT /api/companies/:id
// @access  Private/Admin
const updateCompany = asyncHandler(async (req, res) => {
    const { name, description, role, salary, date, eligibility } = req.body;
    const company = await Company.findById(req.params.id);

    if (company) {
        company.name = name || company.name;
        company.description = description || company.description;
        company.role = role || company.role;
        company.salary = salary || company.salary;
        company.date = date || company.date;
        company.eligibility = eligibility || company.eligibility;

        const updatedCompany = await company.save();
        res.json(updatedCompany);
    } else {
        res.status(404);
        throw new Error('Company not found');
    }
});

// @desc    Delete a company
// @route   DELETE /api/companies/:id
// @access  Private/Admin
const deleteCompany = asyncHandler(async (req, res) => {
    const company = await Company.findById(req.params.id);

    if (company) {
        await company.deleteOne();
        res.json({ message: 'Company removed' });
    } else {
        res.status(404);
        throw new Error('Company not found');
    }
});

// @desc    Check company eligibility
// @route   GET /api/companies/eligibility/:id
// @access  Private
const checkCompanyEligibility = asyncHandler(async (req, res) => {
    const company = await Company.findById(req.params.id);
    const student = await Student.findOne({ user: req.user._id });

    if (!company || !student) {
        res.status(404);
        throw new Error('Company or Student not found');
    }

    const { minCgpa, maxBacklogs, arrearsAllowed, eligibleDepartments } = company.eligibility;

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

    if (!arrearsAllowed && student.arrears > 0) {
        isEligible = false;
        reasons.push(`Arrears not allowed for this company`);
    }

    if (eligibleDepartments.length > 0 && !eligibleDepartments.includes(student.department)) {
        isEligible = false;
        reasons.push(`Eligible departments: ${eligibleDepartments.join(', ')}`);
    }

    res.json({ isEligible, reasons });
});

module.exports = {
    getCompanies,
    createCompany,
    updateCompany,
    deleteCompany,
    checkCompanyEligibility,
};
