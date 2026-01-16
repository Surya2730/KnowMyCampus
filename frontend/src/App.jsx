import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Chatbot from './components/Chatbot';
import Home from './pages/Home';
import Login from './pages/Login';
import Profile from './pages/Profile';
import Events from './pages/Events';
import Companies from './pages/Companies';
import Forum from './pages/Forum';
import ContactUs from './pages/ContactUs';
import ManageNews from './pages/ManageNews';
import ManageStudents from './pages/ManageStudents';
import './index.css';

const MainContent = ({ userInfo, setUserInfo }) => {
  const location = useLocation();
  const isLoginPage = location.pathname === '/login' || !userInfo;

  return (
    <>
      {!isLoginPage && <Navbar userInfo={userInfo} setUserInfo={setUserInfo} />}
      <main className="container" style={{ paddingTop: '20px' }}>
        <Routes>
          <Route path="/" element={userInfo ? <Home /> : <Login setUserInfo={setUserInfo} />} />
          <Route path="/login" element={<Login setUserInfo={setUserInfo} />} />

          {/* Protected Routes */}
          <Route
            path="/profile"
            element={userInfo && userInfo.role === 'Student' ? <Profile /> : <Navigate to="/" />}
          />
          <Route
            path="/events"
            element={userInfo ? <Events /> : <Navigate to="/login" />}
          />
          <Route
            path="/companies"
            element={userInfo ? <Companies /> : <Navigate to="/login" />}
          />
          <Route
            path="/forum"
            element={userInfo ? <Forum /> : <Navigate to="/login" />}
          />
          <Route
            path="/contact"
            element={userInfo ? <ContactUs /> : <Navigate to="/login" />}
          />

          {/* Admin Routes */}
          <Route
            path="/manage-news"
            element={userInfo && userInfo.role === 'Admin' ? <ManageNews /> : <Navigate to="/" />}
          />
          <Route
            path="/manage-students"
            element={userInfo && userInfo.role === 'Admin' ? <ManageStudents /> : <Navigate to="/" />}
          />
        </Routes>
      </main>
      {userInfo && userInfo.role === 'Student' && !isLoginPage && <Chatbot />}
    </>
  );
};

function App() {
  const [userInfo, setUserInfo] = useState(JSON.parse(localStorage.getItem('userInfo')));

  useEffect(() => {
    const handleStorageChange = () => {
      setUserInfo(JSON.parse(localStorage.getItem('userInfo')));
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const isLoginPage = window.location.pathname === '/login';

  return (
    <Router>
      <MainContent userInfo={userInfo} setUserInfo={setUserInfo} />
    </Router>
  );
}

export default App;
