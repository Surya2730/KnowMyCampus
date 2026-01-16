import React, { useState, useEffect } from 'react';
import api from '../services/api';
import '../styles/Lists.css';

const Companies = () => {
    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(true);

    const [showForm, setShowForm] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [currentCompanyId, setCurrentCompanyId] = useState(null);
    const [formData, setFormData] = useState({
        name: '', role: '', description: '', salary: '', date: '',
        eligibility: { minCgpa: 0, maxBacklogs: 0, arrearsAllowed: true, eligibleDepartments: [] }
    });

    const fetchCompanies = async () => {
        try {
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            const isAdmin = userInfo && userInfo.role === 'Admin';
            const { data } = await api.get('/companies');

            if (isAdmin) {
                setCompanies(data);
            } else {
                const companiesWithEligibility = await Promise.all(data.map(async (company) => {
                    try {
                        const { data: eligData } = await api.get(`/companies/eligibility/${company._id}`);
                        return { ...company, ...eligData };
                    } catch (err) {
                        return { ...company, isEligible: false, reasons: ['Error checking eligibility'] };
                    }
                }));
                setCompanies(companiesWithEligibility);
            }
        } catch (err) {
            console.error('Error fetching companies', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCompanies();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editMode) {
                await api.put(`/companies/${currentCompanyId}`, formData);
                alert('Company updated successfully');
            } else {
                await api.post('/companies', formData);
                alert('Company added successfully');
            }
            setShowForm(false);
            setEditMode(false);
            fetchCompanies();
        } catch (err) {
            alert('Operation failed');
        }
    };

    const handleEdit = (company) => {
        setFormData({
            name: company.name,
            role: company.role,
            description: company.description,
            salary: company.salary,
            date: company.date.split('T')[0],
            eligibility: company.eligibility || { minCgpa: 0, maxBacklogs: 0, arrearsAllowed: true, eligibleDepartments: [] }
        });
        setCurrentCompanyId(company._id);
        setEditMode(true);
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Delete this company?')) {
            try {
                await api.delete(`/companies/${id}`);
                fetchCompanies();
            } catch (err) {
                alert('Delete failed');
            }
        }
    };

    const [expandedCriteria, setExpandedCriteria] = useState(null);

    const toggleCriteria = (id) => {
        setExpandedCriteria(expandedCriteria === id ? null : id);
    };

    if (loading) return <div className="loader">Loading companies...</div>;

    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    const isAdmin = userInfo && userInfo.role === 'Admin';

    return (
        <div className="list-page">
            <div className="flex justify-between items-center mb-20">
                <h2 className="title">Placement Drives</h2>
                {isAdmin && (
                    <button className="btn btn-primary" onClick={() => {
                        setShowForm(true); setEditMode(false); setFormData({
                            name: '', role: '', description: '', salary: '', date: '',
                            eligibility: { minCgpa: 0, maxBacklogs: 0, arrearsAllowed: true, eligibleDepartments: [] }
                        });
                    }}>
                        + Add Company
                    </button>
                )}
            </div>

            {showForm && (
                <div className="card mb-20">
                    <h3>{editMode ? 'Edit Company' : 'Add New Company'}</h3>
                    <form onSubmit={handleSubmit} className="admin-form">
                        <div className="grid grid-cols-2 gap-10">
                            <input type="text" placeholder="Company Name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
                            <input type="text" placeholder="Job Role" value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value })} required />
                            <input type="text" placeholder="Salary Package" value={formData.salary} onChange={(e) => setFormData({ ...formData, salary: e.target.value })} required />
                            <input type="date" value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} required />
                            <div className="flex gap-10">
                                <input type="number" step="0.1" placeholder="Min CGPA" value={formData.eligibility.minCgpa} onChange={(e) => setFormData({ ...formData, eligibility: { ...formData.eligibility, minCgpa: e.target.value } })} required />
                                <input type="number" placeholder="Max Backlogs" value={formData.eligibility.maxBacklogs} onChange={(e) => setFormData({ ...formData, eligibility: { ...formData.eligibility, maxBacklogs: e.target.value } })} required />
                            </div>
                            <label className="flex items-center gap-5 mt-10">
                                <input type="checkbox" checked={formData.eligibility.arrearsAllowed} onChange={(e) => setFormData({ ...formData, eligibility: { ...formData.eligibility, arrearsAllowed: e.target.checked } })} />
                                Arrears Allowed
                            </label>
                        </div>
                        <textarea placeholder="Description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} required className="w-full mt-10"></textarea>
                        <div className="flex gap-10 mt-10">
                            <button type="submit" className="btn btn-primary">{editMode ? 'Update' : 'Create'}</button>
                            <button type="button" className="btn btn-secondary" onClick={() => setShowForm(false)}>Cancel</button>
                        </div>
                    </form>
                </div>
            )}

            <div className="grid grid-cols-2">
                {companies.map(company => (
                    <div key={company._id} className="card list-card">
                        <div className="flex justify-between items-center">
                            <h3>{company.name}</h3>
                            <div className="flex items-center gap-10">
                                {!isAdmin ? (
                                    <span className={`status-btn ${company.isEligible ? 'eligible' : 'not-eligible'}`}>
                                        {company.isEligible ? '✅ Eligible' : '❌ Not Eligible'}
                                    </span>
                                ) : (
                                    <div className="flex gap-15">
                                        <button className="btn btn-primary btn-sm" onClick={() => handleEdit(company)}>Edit</button>
                                        <button className="btn btn-danger btn-sm" onClick={() => handleDelete(company._id)}>Delete</button>
                                    </div>
                                )}
                                <button
                                    className="info-icon"
                                    title="Eligibility Criteria"
                                    onClick={() => toggleCriteria(company._id)}
                                >
                                    ℹ️
                                </button>
                            </div>
                        </div>
                        <p className="role"><strong>Role:</strong> {company.role}</p>
                        <p className="description">{company.description}</p>
                        <div className="meta">
                            <p><strong>Package:</strong> {company.salary}</p>
                            <p><strong>Drive Date:</strong> {new Date(company.date).toLocaleDateString()}</p>
                        </div>

                        {expandedCriteria === company._id && (
                            <div className="criteria-details mt-10 p-10 bg-light border-radius-4">
                                <p><strong>Min CGPA:</strong> {company.eligibility?.minCgpa || 0}</p>
                                <p><strong>Max Backlogs:</strong> {company.eligibility?.maxBacklogs || 0}</p>
                                <p><strong>Arrears Allowed:</strong> {company.eligibility?.arrearsAllowed ? 'Yes' : 'No'}</p>
                            </div>
                        )}

                        {!isAdmin && !company.isEligible && (
                            <div className="reasons">
                                <p>Reasons:</p>
                                <ul>
                                    {company.reasons.map((r, i) => <li key={i}>{r}</li>)}
                                </ul>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Companies;
