import React, { useState, useEffect } from 'react';
import api from '../services/api';
import '../styles/Profile.css';

const Profile = () => {
    const [profile, setProfile] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const { data } = await api.get('/students/profile');
                setProfile(data);
                setFormData(data);
            } catch (err) {
                console.error('Error fetching profile', err);
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    const changeHandler = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            const { data } = await api.put('/students/profile', formData);
            setProfile(data);
            setIsEditing(false);
            alert('Profile updated successfully');
        } catch (err) {
            alert('Update failed');
        }
    };

    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    const isAdmin = userInfo && userInfo.role === 'Admin';

    if (loading) return <div className="loader">Loading profile...</div>;

    return (
        <div className="profile-page">
            <div className="card profile-card">
                <h2>Your Academic Profile</h2>
                {!isEditing ? (
                    <div className="profile-details">
                        <p><strong>Name:</strong> {profile.user.name}</p>
                        <p><strong>Email:</strong> {profile.user.email}</p>
                        <p><strong>Roll Number:</strong> {profile.rollNumber}</p>
                        <p><strong>Department:</strong> {profile.department}</p>
                        <p><strong>Year:</strong> {profile.year}</p>
                        <p><strong>CGPA:</strong> {profile.cgpa}</p>
                        <p><strong>Backlogs:</strong> {profile.backlogs}</p>
                        <p><strong>Arrears:</strong> {profile.arrears}</p>
                        {isAdmin && (
                            <button className="btn btn-primary" onClick={() => setIsEditing(true)}>Edit Profile</button>
                        )}
                    </div>
                ) : (
                    <form onSubmit={submitHandler}>
                        <div className="grid grid-cols-2">
                            <div className="form-group">
                                <label>Roll Number</label>
                                <input name="rollNumber" value={formData.rollNumber} onChange={changeHandler} required />
                            </div>
                            <div className="form-group">
                                <label>Department</label>
                                <input name="department" value={formData.department} onChange={changeHandler} required />
                            </div>
                            <div className="form-group">
                                <label>Year</label>
                                <input type="number" name="year" value={formData.year} onChange={changeHandler} required />
                            </div>
                            <div className="form-group">
                                <label>CGPA</label>
                                <input type="number" step="0.01" name="cgpa" value={formData.cgpa} onChange={changeHandler} required />
                            </div>
                            <div className="form-group">
                                <label>Backlogs</label>
                                <input type="number" name="backlogs" value={formData.backlogs} onChange={changeHandler} required />
                            </div>
                            <div className="form-group">
                                <label>Arrears</label>
                                <input type="number" name="arrears" value={formData.arrears} onChange={changeHandler} required />
                            </div>
                        </div>
                        <div className="flex" style={{ gap: '10px', marginTop: '15px' }}>
                            <button type="submit" className="btn btn-success">Save Changes</button>
                            <button type="button" className="btn btn-danger" onClick={() => setIsEditing(false)}>Cancel</button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

export default Profile;
