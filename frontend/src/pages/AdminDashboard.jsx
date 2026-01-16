import React, { useState, useEffect } from 'react';
import api from '../services/api';
import '../styles/Admin.css';

const AdminDashboard = () => {
    const [announcements, setAnnouncements] = useState([]);
    const [events, setEvents] = useState([]);
    const [companies, setCompanies] = useState([]);
    const [posts, setPosts] = useState([]);
    const [activeTab, setActiveTab] = useState('announcements');

    const fetchData = async () => {
        try {
            const [annRes, eventRes, compRes, postRes] = await Promise.all([
                api.get('/announcements'),
                api.get('/events'),
                api.get('/companies'),
                api.get('/forum')
            ]);
            setAnnouncements(annRes.data);
            setEvents(eventRes.data);
            setCompanies(compRes.data);
            setPosts(postRes.data);
        } catch (err) {
            console.error('Error fetching admin data', err);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const deleteHandler = async (type, id) => {
        if (window.confirm('Are you sure you want to delete this?')) {
            try {
                await api.delete(`/${type}/${id}`);
                fetchData();
            } catch (err) {
                alert('Delete failed');
            }
        }
    };

    const [newAnn, setNewAnn] = useState({ title: '', content: '', type: 'General' });
    const [newEvent, setNewEvent] = useState({
        title: '', description: '', venue: '', date: '',
        eligibility: { minCgpa: 0, maxBacklogs: 0, eligibleDepartments: [] }
    });
    const [newComp, setNewComp] = useState({
        name: '', description: '', role: '', salary: '', date: '',
        eligibility: { minCgpa: 0, maxBacklogs: 0, arrearsAllowed: true, eligibleDepartments: [] }
    });

    const addHandler = async (type, data) => {
        try {
            await api.post(`/${type}`, data);
            alert(`${type} added successfully!`);
            fetchData();
        } catch (err) {
            alert('Add failed');
        }
    };

    return (
        <div className="admin-page">
            <h2 className="title">Admin Dashboard</h2>

            <div className="admin-tabs flex">
                <button className={activeTab === 'announcements' ? 'active' : ''} onClick={() => setActiveTab('announcements')}>College News</button>
                <button className={activeTab === 'events' ? 'active' : ''} onClick={() => setActiveTab('events')}>Event Management</button>
                <button className={activeTab === 'companies' ? 'active' : ''} onClick={() => setActiveTab('companies')}>Placement Management</button>
            </div>

            <div className="admin-content card">
                {activeTab === 'announcements' && (
                    <div className="admin-section">
                        <h3>Publish College News</h3>
                        <form className="admin-form" onSubmit={(e) => { e.preventDefault(); addHandler('announcements', newAnn); }}>
                            <div className="form-group">
                                <input type="text" placeholder="Title" value={newAnn.title} onChange={(e) => setNewAnn({ ...newAnn, title: e.target.value })} required />
                                <input type="text" placeholder="Content" value={newAnn.content} onChange={(e) => setNewAnn({ ...newAnn, content: e.target.value })} required />
                                <select value={newAnn.type} onChange={(e) => setNewAnn({ ...newAnn, type: e.target.value })}>
                                    <option value="General">General</option>
                                    <option value="Academic">Academic</option>
                                    <option value="Placement">Placement</option>
                                    <option value="Event">Event</option>
                                </select>
                                <button type="submit" className="btn btn-primary">Add News</button>
                            </div>
                        </form>

                        <h3 style={{ marginTop: '30px' }}>Recent News</h3>
                        <table>
                            <thead>
                                <tr><th>Title</th><th>Type</th><th>Actions</th></tr>
                            </thead>
                            <tbody>
                                {announcements.map(ann => (
                                    <tr key={ann._id}>
                                        <td>{ann.title}</td>
                                        <td>{ann.type}</td>
                                        <td><button className="btn-danger" onClick={() => deleteHandler('announcements', ann._id)}>Delete</button></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {activeTab === 'events' && (
                    <div className="admin-section">
                        <h3>Schedule New Event</h3>
                        <form className="admin-form" onSubmit={(e) => { e.preventDefault(); addHandler('events', newEvent); }}>
                            <div className="grid grid-cols-2 gap-10">
                                <input type="text" placeholder="Event Title" value={newEvent.title} onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })} required />
                                <input type="text" placeholder="Venue" value={newEvent.venue} onChange={(e) => setNewEvent({ ...newEvent, venue: e.target.value })} required />
                                <input type="date" value={newEvent.date} onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })} required />
                                <input type="number" step="0.1" placeholder="Min CGPA" value={newEvent.eligibility.minCgpa} onChange={(e) => setNewEvent({ ...newEvent, eligibility: { ...newEvent.eligibility, minCgpa: e.target.value } })} required />
                                <input type="number" placeholder="Max Backlogs" value={newEvent.eligibility.maxBacklogs} onChange={(e) => setNewEvent({ ...newEvent, eligibility: { ...newEvent.eligibility, maxBacklogs: e.target.value } })} required />
                                <textarea placeholder="Description" value={newEvent.description} onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })} required className="w-full"></textarea>
                            </div>
                            <button type="submit" className="btn btn-primary mt-10">Create Event</button>
                        </form>

                        <h3 style={{ marginTop: '30px' }}>Manage Scheduled Events</h3>
                        <table>
                            <thead>
                                <tr><th>Title</th><th>Venue</th><th>Date</th><th>Criteria</th><th>Actions</th></tr>
                            </thead>
                            <tbody>
                                {events.map(event => (
                                    <tr key={event._id}>
                                        <td>{event.title}</td>
                                        <td>{event.venue}</td>
                                        <td>{new Date(event.date).toLocaleDateString()}</td>
                                        <td>CGPA: {event.eligibility?.minCgpa} | Backlogs: {event.eligibility?.maxBacklogs}</td>
                                        <td><button className="btn-danger" onClick={() => deleteHandler('events', event._id)}>Delete</button></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {activeTab === 'companies' && (
                    <div className="admin-section">
                        <h3>Add Placement Drive</h3>
                        <form className="admin-form" onSubmit={(e) => { e.preventDefault(); addHandler('companies', newComp); }}>
                            <div className="grid grid-cols-2 gap-10">
                                <input type="text" placeholder="Company Name" value={newComp.name} onChange={(e) => setNewComp({ ...newComp, name: e.target.value })} required />
                                <input type="text" placeholder="Job Role" value={newComp.role} onChange={(e) => setNewComp({ ...newComp, role: e.target.value })} required />
                                <input type="text" placeholder="Salary Package" value={newComp.salary} onChange={(e) => setNewComp({ ...newComp, salary: e.target.value })} required />
                                <input type="date" value={newComp.date} onChange={(e) => setNewComp({ ...newComp, date: e.target.value })} required />
                                <input type="number" step="0.1" placeholder="Min CGPA" value={newComp.eligibility.minCgpa} onChange={(e) => setNewComp({ ...newComp, eligibility: { ...newComp.eligibility, minCgpa: e.target.value } })} required />
                                <input type="number" placeholder="Max Backlogs" value={newComp.eligibility.maxBacklogs} onChange={(e) => setNewComp({ ...newComp, eligibility: { ...newComp.eligibility, maxBacklogs: e.target.value } })} required />
                                <textarea placeholder="Description" value={newComp.description} onChange={(e) => setNewComp({ ...newComp, description: e.target.value })} required className="w-full"></textarea>
                            </div>
                            <button type="submit" className="btn btn-primary mt-10">Add Company</button>
                        </form>

                        <h3 style={{ marginTop: '30px' }}>Current Placement Drives</h3>
                        <table>
                            <thead>
                                <tr><th>Name</th><th>Role</th><th>Criteria</th><th>Actions</th></tr>
                            </thead>
                            <tbody>
                                {companies.map(comp => (
                                    <tr key={comp._id}>
                                        <td>{comp.name}</td>
                                        <td>{comp.role}</td>
                                        <td>CGPA: {comp.eligibility?.minCgpa} | Arrears Allowed: {comp.eligibility?.arrearsAllowed ? 'Yes' : 'No'}</td>
                                        <td><button className="btn-danger" onClick={() => deleteHandler('companies', comp._id)}>Delete</button></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;
