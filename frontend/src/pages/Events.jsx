import React, { useState, useEffect } from 'react';
import api from '../services/api';
import '../styles/Lists.css';

const Events = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    const [showForm, setShowForm] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [currentEventId, setCurrentEventId] = useState(null);
    const [formData, setFormData] = useState({
        title: '', description: '', venue: '', date: '',
        eligibility: { minCgpa: 0, maxBacklogs: 0, eligibleDepartments: [] }
    });

    const fetchEvents = async () => {
        try {
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            const isAdmin = userInfo && userInfo.role === 'Admin';
            const { data } = await api.get('/events');

            if (isAdmin) {
                setEvents(data);
            } else {
                const eventsWithEligibility = await Promise.all(data.map(async (event) => {
                    try {
                        const { data: eligData } = await api.get(`/events/eligibility/${event._id}`);
                        return { ...event, ...eligData };
                    } catch (err) {
                        return { ...event, isEligible: false, reasons: ['Error checking eligibility'] };
                    }
                }));
                setEvents(eventsWithEligibility);
            }
        } catch (err) {
            console.error('Error fetching events', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEvents();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editMode) {
                // Assuming there's a PUT route, otherwise we'd need to add one. 
                // For now, let's assume we can at least create and delete per previous dashboard.
                // I'll stick to creation for simplicity if PUT isn't implemented, 
                // but usually Edit implies PUT. I'll add PUT logic.
                await api.put(`/events/${currentEventId}`, formData);
                alert('Event updated successfully');
            } else {
                await api.post('/events', formData);
                alert('Event added successfully');
            }
            setShowForm(false);
            setEditMode(false);
            fetchEvents();
        } catch (err) {
            alert('Operation failed');
        }
    };

    const handleEdit = (event) => {
        setFormData({
            title: event.title,
            description: event.description,
            venue: event.venue,
            date: event.date.split('T')[0],
            eligibility: event.eligibility || { minCgpa: 0, maxBacklogs: 0, eligibleDepartments: [] }
        });
        setCurrentEventId(event._id);
        setEditMode(true);
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Delete this event?')) {
            try {
                await api.delete(`/events/${id}`);
                fetchEvents();
            } catch (err) {
                alert('Delete failed');
            }
        }
    };

    const [expandedCriteria, setExpandedCriteria] = useState(null);

    const toggleCriteria = (id) => {
        setExpandedCriteria(expandedCriteria === id ? null : id);
    };

    if (loading) return <div className="loader">Loading events...</div>;

    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    const isAdmin = userInfo && userInfo.role === 'Admin';

    return (
        <div className="list-page">
            <div className="flex justify-between items-center mb-20">
                <h2 className="title">Upcoming Events</h2>
                {isAdmin && (
                    <button className="btn btn-primary" onClick={() => {
                        setShowForm(true); setEditMode(false); setFormData({
                            title: '', description: '', venue: '', date: '',
                            eligibility: { minCgpa: 0, maxBacklogs: 0, eligibleDepartments: [] }
                        });
                    }}>
                        + Add Event
                    </button>
                )}
            </div>

            {showForm && (
                <div className="card mb-20">
                    <h3>{editMode ? 'Edit Event' : 'Add New Event'}</h3>
                    <form onSubmit={handleSubmit} className="admin-form">
                        <div className="grid grid-cols-2 gap-10">
                            <input type="text" placeholder="Title" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required />
                            <input type="text" placeholder="Venue" value={formData.venue} onChange={(e) => setFormData({ ...formData, venue: e.target.value })} required />
                            <input type="date" value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} required />
                            <div className="flex gap-10">
                                <input type="number" step="0.1" placeholder="Min CGPA" value={formData.eligibility.minCgpa} onChange={(e) => setFormData({ ...formData, eligibility: { ...formData.eligibility, minCgpa: e.target.value } })} required />
                                <input type="number" placeholder="Max Backlogs" value={formData.eligibility.maxBacklogs} onChange={(e) => setFormData({ ...formData, eligibility: { ...formData.eligibility, maxBacklogs: e.target.value } })} required />
                            </div>
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
                {events.map(event => (
                    <div key={event._id} className="card list-card">
                        <div className="flex justify-between items-center">
                            <h3>{event.title}</h3>
                            <div className="flex items-center gap-10">
                                {!isAdmin ? (
                                    <span className={`status-btn ${event.isEligible ? 'eligible' : 'not-eligible'}`}>
                                        {event.isEligible ? '✅ Eligible' : '❌ Not Eligible'}
                                    </span>
                                ) : (
                                    <div className="flex gap-15">
                                        <button className="btn btn-primary btn-sm" onClick={() => handleEdit(event)}>Edit</button>
                                        <button className="btn btn-danger btn-sm" onClick={() => handleDelete(event._id)}>Delete</button>
                                    </div>
                                )}
                                <button
                                    className="info-icon"
                                    title="Eligibility Criteria"
                                    onClick={() => toggleCriteria(event._id)}
                                >
                                    ℹ️
                                </button>
                            </div>
                        </div>
                        <p className="description">{event.description}</p>
                        <div className="meta">
                            <p><strong>Venue:</strong> {event.venue}</p>
                            <p><strong>Date:</strong> {new Date(event.date).toLocaleDateString()}</p>
                        </div>

                        {expandedCriteria === event._id && (
                            <div className="criteria-details mt-10 p-10 bg-light border-radius-4">
                                <p><strong>Min CGPA:</strong> {event.eligibility?.minCgpa || 0}</p>
                                <p><strong>Max Backlogs:</strong> {event.eligibility?.maxBacklogs || 0}</p>
                            </div>
                        )}

                        {!isAdmin && !event.isEligible && (
                            <div className="reasons">
                                <p>Reasons:</p>
                                <ul>
                                    {event.reasons.map((r, i) => <li key={i}>{r}</li>)}
                                </ul>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Events;
