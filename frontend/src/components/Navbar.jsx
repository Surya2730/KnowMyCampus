import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/Navbar.css';

const Navbar = ({ userInfo, setUserInfo }) => {
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = React.useState(false);

    const logoutHandler = () => {
        setIsMenuOpen(false);
        localStorage.removeItem('userInfo');
        setUserInfo(null);
        navigate('/login');
    };

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const closeMenu = () => {
        setIsMenuOpen(false);
    };

    return (
        <nav className="navbar relative">
            <div className="container flex justify-between items-center">
                <Link to="/" className="navbar-logo" onClick={closeMenu}>
                    KnowMyCampus
                </Link>

                <button className="hamburger-icon" onClick={toggleMenu}>
                    {isMenuOpen ? '✕' : '☰'}
                </button>

                <ul className={`navbar-links flex ${isMenuOpen ? 'open' : ''}`}>
                    <li><Link to="/" onClick={closeMenu}>Home</Link></li>
                    {userInfo && (
                        <>
                            <li><Link to="/events" onClick={closeMenu}>Events</Link></li>
                            <li><Link to="/companies" onClick={closeMenu}>Companies</Link></li>
                            <li><Link to="/forum" onClick={closeMenu}>Discussion</Link></li>
                            <li><Link to="/contact" onClick={closeMenu}>Contact</Link></li>
                            {userInfo.role === 'Student' && <li><Link to="/profile" onClick={closeMenu}>Profile</Link></li>}
                            {userInfo.role === 'Admin' && (
                                <>
                                    <li><Link to="/manage-news" onClick={closeMenu}>Manage News</Link></li>
                                    <li><Link to="/manage-students" onClick={closeMenu}>Manage Students</Link></li>
                                </>
                            )}
                            <li className="logout-btn" onClick={logoutHandler}>Logout</li>
                        </>
                    )}
                    {!userInfo && (
                        <li><Link to="/login" onClick={closeMenu}>Login</Link></li>
                    )}
                </ul>
            </div>
        </nav>
    );
};

export default Navbar;
