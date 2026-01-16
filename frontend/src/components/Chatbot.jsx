import React, { useState } from 'react';
import api from '../services/api';
import '../styles/Chatbot.css';

const Chatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { text: "Welcome back! I'm your Personalized Assistant. What would you like to check today?", isBot: true }
    ]);
    const [loading, setLoading] = useState(false);
    const [view, setView] = useState('menu'); // 'menu' or 'query'

    const handleAction = async (query, label) => {
        setMessages([...messages, { text: label, isBot: false }]);
        setLoading(true);
        setView('query');

        try {
            const { data } = await api.post('/chatbot/query', { query });
            setMessages(prev => [...prev, {
                text: data.answer,
                isBot: true,
                data: data.data
            }]);
        } catch (err) {
            setMessages(prev => [...prev, { text: "I'm unable to fetch your data right now.", isBot: true }]);
        } finally {
            setLoading(false);
        }
    };

    const resetAssistant = () => {
        setMessages([{ text: "What else can I help you with?", isBot: true }]);
        setView('menu');
    };

    return (
        <div className={`chatbot-wrapper ${isOpen ? 'open' : ''}`}>
            {!isOpen && (
                <button className="chat-toggle" onClick={() => setIsOpen(true)}>
                    🎓 Assistant
                </button>
            )}

            {isOpen && (
                <div className="chat-window card">
                    <div className="chat-header flex justify-between items-center">
                        <h3>Personalized Assistant</h3>
                        <button className="close-btn" onClick={() => setIsOpen(false)}>×</button>
                    </div>
                    <div className="chat-body">
                        {messages.map((msg, i) => (
                            <div key={i} className={`message ${msg.isBot ? 'bot' : 'user'}`}>
                                {msg.text}
                                {msg.data && msg.data.type === 'academic_profile' && (
                                    <div className="academic-profile-details mt-10">
                                        <div className="profile-info-grid">
                                            <p><strong>Name:</strong> {msg.data.name}</p>
                                            <p><strong>Roll:</strong> {msg.data.rollNumber}</p>
                                            <p><strong>CGPA:</strong> {msg.data.cgpa}</p>
                                            <p><strong>Arrears:</strong> {msg.data.arrears}</p>
                                        </div>
                                        {msg.data.semesterResults && msg.data.semesterResults.length > 0 && (
                                            <div className="semester-chart-container mt-15">
                                                <h5>Semester Performance (SGPA)</h5>
                                                <div className="bar-chart flex items-end gap-5 h-100">
                                                    {msg.data.semesterResults.map((sgpa, idx) => (
                                                        <div key={idx} className="chart-bar-wrapper flex flex-column items-center">
                                                            <div
                                                                className="chart-bar"
                                                                style={{ height: `${(sgpa / 10) * 100}%` }}
                                                                title={`Sem ${idx + 1}: ${sgpa}`}
                                                            >
                                                                <span className="bar-value">{sgpa}</span>
                                                            </div>
                                                            <span className="bar-label">S{idx + 1}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))}

                        {view === 'menu' && !loading && (
                            <div className="assistant-buttons">
                                <button className="assist-btn" onClick={() => handleAction('academic profile', '📋 My Academic Profile')}>My Academic Profile</button>
                                <button className="assist-btn" onClick={() => handleAction('cgpa', '⭐ Check CGPA')}>Check CGPA</button>
                                <button className="assist-btn" onClick={() => handleAction('backlogs', '❗ Arrears & Backlogs')}>Arrears & Backlogs</button>
                            </div>
                        )}

                        {loading && <div className="message bot">Fetching details...</div>}

                        {view === 'query' && !loading && (
                            <button className="back-btn" onClick={resetAssistant}>← Back to Options</button>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Chatbot;
