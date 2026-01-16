import React, { useState, useEffect } from 'react';
import api from '../services/api';
import NewsTicker from '../components/NewsTicker';
import '../styles/Home.css';

const Home = () => {
    const [announcements, setAnnouncements] = useState([]);
    const [events, setEvents] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [eventCategory, setEventCategory] = useState('upcoming');

    const fetchData = async () => {
        try {
            const { data: annData } = await api.get('/announcements');
            setAnnouncements(annData);

            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            if (userInfo) {
                const { data: eventData } = await api.get('/events');
                setEvents(eventData);
            }
        } catch (err) {
            console.error('Error fetching landing data', err);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const filteredEvents = events.filter(event => {
        const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase());
        const eventDate = new Date(event.date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (eventCategory === 'upcoming') return matchesSearch && eventDate >= today;
        if (eventCategory === 'past') return matchesSearch && eventDate < today;
        return matchesSearch;
    });

    return (
        <div className="home-page">
            <NewsTicker />

            <section className="hero-section card">
                <h1>KnowMyCampus Institute of Technology</h1>
                <p>Empowering students with technology, resources, and community engagement.</p>
            </section>

            <section className="events-hub mt-20">
                <div className="hub-header flex justify-between items-center">
                    <h2 className="title">Campus Events Hub</h2>
                    <div className="hub-controls flex gap-10">
                        <input
                            type="text"
                            placeholder="Search events..."
                            className="search-input"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <select
                            className="category-dropdown"
                            value={eventCategory}
                            onChange={(e) => setEventCategory(e.target.value)}
                        >
                            <option value="all">All Events</option>
                            <option value="upcoming">Upcoming Events</option>
                            <option value="past">Past Events</option>
                        </select>
                    </div>
                </div>
                <div className="events-grid mt-15">
                    {filteredEvents.length > 0 ? (
                        filteredEvents.map(event => (
                            <div key={event._id} className="event-strip card">
                                <div className="event-date-box">
                                    <span className="month">{new Date(event.date).toLocaleString('default', { month: 'short' })}</span>
                                    <span className="day">{new Date(event.date).getDate()}</span>
                                </div>
                                <div className="event-info">
                                    <h4>{event.title}</h4>
                                    <p className="description">{event.description.substring(0, 100)}...</p>
                                    <p className="meta">📍 {event.venue} | 🕒 {new Date(event.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="no-events card">No events found in this category.</p>
                    )}
                </div>
            </section>

            <h2 className="title mt-30">Explore Our Campus</h2>
            <div className="details-grid">
                <section className="detail-card card">
                    <h3>🏫 Campus Life</h3>
                    <p>Our 50-acre lush green campus is equipped with state-of-the-art infrastructure, including smart classrooms and advanced laboratories.</p>
                </section>
                <section className="detail-card card">
                    <h3>🏠 Residential Life</h3>
                    <p>Separate hostels for boys and girls with 24/7 security, high-speed Wi-Fi, and recreational common rooms.</p>
                </section>
                <section className="detail-card card">
                    <h3>👨‍🎓 Placement Cell</h3>
                    <p>Dedicated placement wing ensuring 95%+ recruitment annually with top MNCs like Google and Amazon.</p>
                </section>
                <section className="detail-card card">
                    <h3>📚 Academics</h3>
                    <p>World-class industry-aligned education in engineering, management, and science taught by expert faculty.</p>
                </section>
                <section className="detail-card card">
                    <h3>🍔 Food & Cafeteria</h3>
                    <p>Nutritious multi-cuisine food served in spacious dining halls. Our hub for student interactions.</p>
                </section>
                <section className="detail-card card">
                    <h3>🏪 Refreshment Hubs</h3>
                    <p>Strategic coffee houses across the campus to keep students energized throughout the day.</p>
                </section>
            </div>
        </div>
    );
};

export default Home;
