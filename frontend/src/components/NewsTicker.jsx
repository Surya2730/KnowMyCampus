import React, { useState, useEffect } from 'react';
import api from '../services/api';
import './NewsTicker.css';

const NewsTicker = () => {
    const [news, setNews] = useState([]);

    useEffect(() => {
        const fetchNews = async () => {
            try {
                const { data } = await api.get('/announcements');
                setNews(data.slice(0, 5)); // Get latest 5
            } catch (error) {
                console.error('Error fetching news ticker', error);
            }
        };
        fetchNews();
    }, []);

    return (
        <div className="ticker-wrapper">
            <div className="ticker-label">LATEST NEWS</div>
            <div className="ticker-content">
                <div className="ticker-text">
                    {news.length > 0 ? (
                        news.map((item, index) => (
                            <span key={item._id}>
                                {item.title}: {item.content}
                                {index !== news.length - 1 && ' | '}
                            </span>
                        ))
                    ) : (
                        <span>Welcome to KnowMyCampus! Check out the latest events and placement drives.</span>
                    )}
                </div>
            </div>
        </div>
    );
};

export default NewsTicker;
