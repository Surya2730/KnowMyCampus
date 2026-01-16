import React, { useState, useEffect } from 'react';
import api from '../services/api';
import '../styles/Admin.css';

const ManageStudents = () => {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editMode, setEditMode] = useState(false);
    const [currentStudent, setCurrentStudent] = useState(null);
    const [formData, setFormData] = useState({
        rollNumber: '', department: '', year: '', cgpa: 0, backlogs: 0, arrears: 0
    });

    const fetchStudents = async () => {
        try {
            const { data } = await api.get('/students');
            setStudents(data);
        } catch (err) {
            console.error('Error fetching students', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStudents();
    }, []);

    const handleEdit = (student) => {
        setCurrentStudent(student);
        setFormData({
            rollNumber: student.rollNumber,
            department: student.department,
            year: student.year,
            cgpa: student.cgpa,
            backlogs: student.backlogs,
            arrears: student.arrears || 0,
            semesterResults: student.semesterResults ? student.semesterResults.join(', ') : ''
        });
        setEditMode(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const cleanData = {
                ...formData,
                semesterResults: formData.semesterResults.split(',').map(n => parseFloat(n.trim())).filter(n => !isNaN(n))
            };
            await api.put(`/students/${currentStudent._id}`, cleanData);
            alert('Student profile updated successfully');
            setEditMode(false);
            fetchStudents();
        } catch (err) {
            alert('Update failed');
        }
    };

    if (loading) return <div className="loader">Loading students...</div>;

    return (
        <div className="admin-page">
            <h2 className="title mb-20">Manage Student Profiles</h2>

            {editMode && (
                <div className="card mb-20">
                    <h3>Edit Profile: {currentStudent.user.name}</h3>
                    <form onSubmit={handleSubmit} className="admin-form">
                        <div className="grid grid-cols-2 gap-10">
                            <div className="form-group">
                                <label>Department</label>
                                <input name="department" value={formData.department} onChange={(e) => setFormData({ ...formData, department: e.target.value })} required />
                            </div>
                            <div className="form-group">
                                <label>Year</label>
                                <input type="number" name="year" value={formData.year} onChange={(e) => setFormData({ ...formData, year: e.target.value })} required />
                            </div>
                            <div className="form-group">
                                <label>CGPA</label>
                                <input type="number" step="0.01" name="cgpa" value={formData.cgpa} onChange={(e) => setFormData({ ...formData, cgpa: e.target.value })} required />
                            </div>
                            <div className="form-group">
                                <label>Arrears Count</label>
                                <input type="number" name="arrears" value={formData.arrears} onChange={(e) => setFormData({ ...formData, arrears: e.target.value })} required />
                            </div>
                            <div className="form-group">
                                <label>Backlogs</label>
                                <input type="number" name="backlogs" value={formData.backlogs} onChange={(e) => setFormData({ ...formData, backlogs: e.target.value })} required />
                            </div>
                            <div className="form-group">
                                <label>Semester SGPAs (comma separated)</label>
                                <input name="semesterResults" value={formData.semesterResults} onChange={(e) => setFormData({ ...formData, semesterResults: e.target.value })} placeholder="7.5, 8.2, 7.9..." />
                            </div>
                        </div>
                        <div className="flex gap-10 mt-15">
                            <button type="submit" className="btn btn-primary">Save Changes</button>
                            <button type="button" className="btn btn-secondary" onClick={() => setEditMode(false)}>Cancel</button>
                        </div>
                    </form>
                </div>
            )}

            <div className="card">
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Roll Number</th>
                            <th>Dept</th>
                            <th>Year</th>
                            <th>CGPA</th>
                            <th>Backlogs</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {students.map(s => (
                            <tr key={s._id}>
                                <td>{s.user.name}</td>
                                <td>{s.rollNumber}</td>
                                <td>{s.department}</td>
                                <td>{s.year}</td>
                                <td>{s.cgpa}</td>
                                <td>{s.backlogs}</td>
                                <td>
                                    <button className="btn btn-primary btn-sm mr-15" onClick={() => handleEdit(s)}>Edit</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ManageStudents;
