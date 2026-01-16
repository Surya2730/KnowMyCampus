import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/Navbar.css';

const Navbar = ({ userInfo, setUserInfo }) => {
    const navigate = useNavigate();

    const logoutHandler = () => {
        localStorage.removeItem('userInfo');
        setUserInfo(null);
        navigate('/login');
    };

    return (
        <nav className="navbar">
            <div className="container flex justify-between items-center">
                <Link to="/" className="navbar-logo">
                    KnowMyCampus
                </Link>
                <ul className="navbar-links flex">
                    <li><Link to="/">Home</Link></li>
                    {userInfo && (
                        <>
                            <li><Link to="/events">Events</Link></li>
                            <li><Link to="/companies">Companies</Link></li>
                            <li><Link to="/forum">Discussion</Link></li>
                            <li><Link to="/contact">Contact</Link></li>
                            {userInfo.role === 'Student' && <li><Link to="/profile">Profile</Link></li>}
                            {userInfo.role === 'Admin' && (
                                <>
                                    <li><Link to="/manage-news">Manage News</Link></li>
                                    <li><Link to="/manage-students">Manage Students</Link></li>
                                </>
                            )}
                            <li className="logout-btn" onClick={logoutHandler}>Logout</li>
                        </>
                    )}
                    {!userInfo && (
                        <li><Link to="/login">Login</Link></li>
                    )}
                </ul>
            </div>
        </nav>
    );
};

export default Navbar;
