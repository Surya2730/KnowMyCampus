const asyncHandler = require('express-async-handler');
const Student = require('../models/Student');
const Company = require('../models/Company');
const Event = require('../models/Event');

// @desc    Query the chatbot
// @route   POST /api/chatbot/query
// @access  Private
const queryChatbot = asyncHandler(async (req, res) => {
    const { query } = req.body;
    const student = await Student.findOne({ user: req.user._id });

    if (!student) {
        res.status(404);
        throw new Error('Student profile not found');
    }

    const lowerQuery = query.toLowerCase();

    // Basic Rule-based matching
    if (lowerQuery.includes('academic profile') || lowerQuery.includes('profile details')) {
        return res.json({
            answer: "Here is your detailed academic profile.",
            data: {
                type: 'academic_profile',
                name: req.user.name,
                rollNumber: student.rollNumber,
                cgpa: student.cgpa,
                arrears: student.arrears,
                backlogs: student.backlogs,
                semesterResults: student.semesterResults || []
            }
        });
    }

    if (lowerQuery.includes('cgpa')) {
        return res.json({ answer: `Your current CGPA is ${student.cgpa}.` });
    }

    if (lowerQuery.includes('backlog') || lowerQuery.includes('arrear')) {
        return res.json({ answer: `You have ${student.backlogs} backlogs and ${student.arrears} arrears.` });
    }

    if (lowerQuery.includes('eligible') && lowerQuery.includes('company')) {
        // Find a specific company name in the query if possible, else return general status
        const companies = await Company.find({});
        let foundCompany = null;

        for (let company of companies) {
            if (lowerQuery.includes(company.name.toLowerCase())) {
                foundCompany = company;
                break;
            }
        }

        if (foundCompany) {
            const { minCgpa, maxBacklogs, arrearsAllowed } = foundCompany.eligibility;
            let eligible = true;
            if (student.cgpa < minCgpa) eligible = false;
            if (student.backlogs > maxBacklogs) eligible = false;
            if (!arrearsAllowed && student.arrears > 0) eligible = false;

            return res.json({
                answer: eligible
                    ? `Yes, you are eligible for ${foundCompany.name}.`
                    : `No, you are not eligible for ${foundCompany.name} based on current criteria.`
            });
        }

        return res.json({ answer: "Please specify the company name to check eligibility." });
    }

    if (lowerQuery.includes('events')) {
        const events = await Event.find({ date: { $gte: new Date() } });
        const eventTitles = events.map(e => e.title).join(', ');
        return res.json({ answer: `Upcoming events you can check out: ${eventTitles || 'None at the moment'}.` });
    }

    res.json({ answer: "I'm sorry, I don't understand that query yet. You can ask about your CGPA, backlogs, eligibility for a company, or upcoming events." });
});

module.exports = { queryChatbot };
