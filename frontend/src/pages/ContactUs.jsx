import React, { useState, useEffect } from 'react';
import api from '../services/api';

const ContactUs = () => {
    const [contact, setContact] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchContact = async () => {
            try {
                const { data } = await api.get('/contact');
                setContact(data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching contact details', error);
                setLoading(false);
            }
        };
        fetchContact();
    }, []);

    if (loading) return <div className="loader">Loading contact details...</div>;

    return (
        <div className="contact-container">
            <div className="card">
                <h1 style={{ textAlign: 'center', color: 'var(--primary-color)', marginBottom: '30px' }}>Contact Information</h1>
                {contact ? (
                    <div className="contact-details" style={{ display: 'grid', gap: '20px', maxWidth: '600px', margin: '0 auto' }}>
                        <div className="contact-item">
                            <h3>College Name</h3>
                            <p>{contact.collegeName}</p>
                        </div>
                        <div className="contact-item">
                            <h3>Address</h3>
                            <p>{contact.address}</p>
                        </div>
                        <div className="contact-item">
                            <h3>Support Email</h3>
                            <p><a href={`mailto:${contact.email}`}>{contact.email}</a></p>
                        </div>
                        <div className="contact-item">
                            <h3>Phone Number</h3>
                            <p>{contact.phone}</p>
                        </div>
                        <div className="contact-item">
                            <h3>Official Website</h3>
                            <p><a href={`https://${contact.website}`} target="_blank" rel="noopener noreferrer">{contact.website}</a></p>
                        </div>
                        <div className="contact-item">
                            <h3>Office Hours</h3>
                            <p>{contact.officeHours}</p>
                        </div>
                    </div>
                ) : (
                    <p style={{ textAlign: 'center' }}>Unable to load contact information.</p>
                )}
            </div>
        </div>
    );
};

export default ContactUs;
