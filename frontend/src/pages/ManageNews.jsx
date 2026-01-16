import React, { useState, useEffect } from 'react';
import api from '../services/api';
import '../styles/Admin.css';

const ManageNews = () => {
    const [announcements, setAnnouncements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [currentId, setCurrentId] = useState(null);
    const [formData, setFormData] = useState({
        title: '', content: '', type: 'General'
    });

    const fetchNews = async () => {
        try {
            const { data } = await api.get('/announcements');
            setAnnouncements(data);
        } catch (err) {
            console.error('Error fetching news', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNews();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editMode) {
                // We also need PUT /api/announcements/:id in backend
                await api.put(`/announcements/${currentId}`, formData);
                alert('News updated successfully');
            } else {
                await api.post('/announcements', formData);
                alert('News published successfully');
            }
            setShowForm(false);
            setEditMode(false);
            fetchNews();
        } catch (err) {
            alert('Operation failed');
        }
    };

    const handleEdit = (ann) => {
        setFormData({ title: ann.title, content: ann.content, type: ann.type });
        setCurrentId(ann._id);
        setEditMode(true);
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Delete this news?')) {
            try {
                await api.delete(`/announcements/${id}`);
                fetchNews();
            } catch (err) {
                alert('Delete failed');
            }
        }
    };

    if (loading) return <div className="loader">Loading news...</div>;

    return (
        <div className="admin-page">
            <div className="flex justify-between items-center mb-20">
                <h2 className="title">Manage College News</h2>
                <button className="btn btn-primary" onClick={() => { setShowForm(true); setEditMode(false); setFormData({ title: '', content: '', type: 'General' }); }}>
                    + Publish News
                </button>
            </div>

            {showForm && (
                <div className="card mb-20">
                    <h3>{editMode ? 'Edit News' : 'Publish New Announcement'}</h3>
                    <form onSubmit={handleSubmit} className="admin-form">
                        <div className="form-group grid grid-cols-2 gap-10">
                            <input type="text" placeholder="Title" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required />
                            <select value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value })}>
                                <option value="General">General</option>
                                <option value="Academic">Academic</option>
                                <option value="Placement">Placement</option>
                                <option value="Event">Event</option>
                            </select>
                        </div>
                        <textarea placeholder="Content" value={formData.content} onChange={(e) => setFormData({ ...formData, content: e.target.value })} required className="w-full mt-10"></textarea>
                        <div className="flex gap-10 mt-10">
                            <button type="submit" className="btn btn-primary">{editMode ? 'Update' : 'Publish'}</button>
                            <button type="button" className="btn btn-secondary" onClick={() => setShowForm(false)}>Cancel</button>
                        </div>
                    </form>
                </div>
            )}

            <div className="card">
                <table>
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th>Type</th>
                            <th>Posted On</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {announcements.map(ann => (
                            <tr key={ann._id}>
                                <td>{ann.title}</td>
                                <td>{ann.type}</td>
                                <td>{new Date(ann.createdAt).toLocaleDateString()}</td>
                                <td>
                                    <button className="btn btn-primary btn-sm mr-15" onClick={() => handleEdit(ann)}>Edit</button>
                                    <button className="btn btn-danger btn-sm" onClick={() => handleDelete(ann._id)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ManageNews;
