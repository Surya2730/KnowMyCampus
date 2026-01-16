import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import '../styles/Auth.css';
import { GoogleLogin } from '@react-oauth/google';

const Login = ({ setUserInfo }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            const { data } = await api.post('/auth/login', { email, password });
            localStorage.setItem('userInfo', JSON.stringify(data));
            setUserInfo(data);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid credentials');
        }
    };

    const handleGoogleSuccess = async (response) => {
        try {
            const { data } = await api.post('/auth/google', { token: response.credential });
            localStorage.setItem('userInfo', JSON.stringify(data));
            setUserInfo(data);
            navigate('/');
        } catch (err) {
            setError('Google Login Failed');
        }
    };

    return (
        <div className="auth-container">
            <div className="card auth-card">
                <h2>Welcome to KnowMyCampus</h2>
                {error && <div className="error-msg">{error}</div>}

                <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'center' }}>
                    <GoogleLogin
                        onSuccess={handleGoogleSuccess}
                        onError={() => setError('Google Login Failed')}
                    />
                </div>

                <div style={{ textAlign: 'center', margin: '15px 0', color: '#888', position: 'relative' }}>
                    <span style={{ background: '#fff', padding: '0 10px', position: 'relative', zIndex: 1 }}>OR</span>
                    <hr style={{ position: 'absolute', top: '50%', width: '100%', border: '0', borderTop: '1px solid #eee' }} />
                </div>

                <form onSubmit={submitHandler}>
                    <div className="form-group">
                        <label>Email Address</label>
                        <input
                            type="email"
                            placeholder="Enter email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input
                            type="password"
                            placeholder="Enter password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="btn btn-primary w-full">Sign In</button>
                </form>

                <div className="auth-footer" style={{ marginTop: '20px', fontSize: '0.9rem', color: '#777' }}>
                    Registration is disabled. Sign in with Google to auto-create an account.
                </div>
            </div>
        </div>
    );
};

export default Login;
