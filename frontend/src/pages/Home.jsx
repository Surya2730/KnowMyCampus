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
                <img src="/header 06.png" alt="College Logo" className="hero-image" />
                {/* <h1>Bannari Amman Institute of Technology</h1> */}
                <h3 style={{ textAlign: 'left' }}>ABOUT CAMPUS</h3>
                <p style={{ textAlign: 'justify' }}>Bannari Amman Institute of Technology is an autonomous, self-financing engineering college approved by AICTE and affiliated to Anna University.
                    Located on the banks of the Bhavani River, the campus offers a peaceful, nature-friendly learning environment away from city life.
                    It features well-planned academic blocks, hostels, libraries, labs, and student facilities, along with ATMs, a co-operative store, and a health clinic.</p>
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

            <h2 className="title mt-30">EXPLORE OUR CAMPUS</h2>
            <div className="details-grid">
                <section className="detail-card card">
                    <h3>CAMPUS LIFE</h3>
                    <img src="/campus photo.avif" alt="Campus Life" className="card-image" />
                    <p>Our 50-acre lush green campus is equipped with state-of-the-art infrastructure, including smart classrooms and advanced laboratories.</p>
                </section>
                <section className="detail-card card">
                    <h3>RESIDENTIAL LIFE</h3>
                    <img src="/hostel.jpg" alt="Residential Life" className="card-image" />
                    <p>Separate hostels for boys and girls with 24/7 security, high-speed Wi-Fi, and recreational common rooms.</p>
                </section>
                <section className="detail-card card">
                    <h3>PLACEMENT CELL</h3>
                    <img src="/placement.jpg" alt="Placement Cell" className="card-image" />
                    <p>Dedicated placement wing ensuring 95%+ recruitment annually with top MNCs like Juspay and Zoho.</p>
                </section>
                <section className="detail-card card">
                    <h3>ACADEMICS</h3>
                    <img src="/class.webp" alt="Academics" className="card-image" />
                    <p>World-class industry-aligned education in engineering, management, and science taught by expert faculty.</p>
                </section>
                <section className="detail-card card">
                    <h3>RESEARCH PARK</h3>
                    <img src="/research-park.avif" alt="Research Park" className="card-image" />
                    <p>A dedicated ecosystem for innovation and entrepreneurship, fostering collaboration between students and industry partners.</p>
                </section>
                <section className="detail-card card">
                    <h3>SPECIAL LAB</h3>
                    <img src="/special lab.jpg" alt="Special Lab" className="card-image" />
                    <p>Equipped with the latest technology and high-end workstations designed for advanced research and practical learning.</p>
                </section>
                <section className="detail-card card">
                    <h3>FOOD & CAFETERIA</h3>
                    <img src="/cafe.jpg" alt="Food & Cafeteria" className="card-image" />
                    <p>Nutritious multi-cuisine food served in spacious dining halls. Our hub for student interactions.</p>
                </section>
                <section className="detail-card card">
                    <h3>SPORTS & GAMES</h3>
                    <img src="/ground.jpg" alt="Sports" className="card-image" />
                    <p>World-class sports facilities including professional-grade cricket grounds, football fields, and indoor sports complexes.</p>
                </section>
                
                <section className="detail-card card">
                    <h3>SEMINAR HALL</h3>
                    <img src="/seminar hall.jpg" alt="Seminar Hall" className="card-image" />
                    <p>Spacious and air-conditioned halls perfectly suited for international workshops, guest lectures, and student presentations.</p>
                </section>
                
            </div>
        </div>
    );
};

export default Home;
