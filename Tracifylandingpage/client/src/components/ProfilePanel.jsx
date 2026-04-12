import React, { useState } from 'react';
import axios from 'axios';
import '../css_file/ProfilePanel.css';

const ProfilePanel = ({ user, onClose, onLogin, onLogout, onCreateAccount }) => {
    const [loginData, setLoginData] = useState({ username: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const handleLoginChange = (e) => {
        setLoginData({ ...loginData, [e.target.name]: e.target.value });
    };

    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const res = await axios.post('http://localhost:5000/api/login', loginData,{ withCredentials: true });
            onLogin(res.data.userId);
            onClose();
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="profile-overlay animate-fade-in" onClick={onClose}>
            <div className="glass-panel profile-card" onClick={e => e.stopPropagation()}>
                <button className="close-btn" onClick={onClose}>&times;</button>

                {!user ? (
                    // LOGIN VIEW
                    <div className="login-view">
                        <h2>Login</h2>
                        <p className="form-subtitle">Access your Tracify account</p>

                        {error && <div className="error-msg">{error}</div>}

                        <form onSubmit={handleLoginSubmit} className="login-form">
                            <input
                                type="text"
                                name="username"
                                placeholder="User ID"
                                required
                                className="glass-input"
                                onChange={handleLoginChange}
                            />
                            <input
                                type="password"
                                name="password"
                                placeholder="Password"
                                required
                                className="glass-input"
                                onChange={handleLoginChange}
                            />

                            <button type="submit" className="glass-btn primary-btn submit-btn" disabled={loading}>
                                {loading ? 'Logging in...' : 'Login'}
                            </button>
                        </form>

                        <div className="create-account-link">
                            <p>New to Tracify?</p>
                            <button className="glass-btn small-btn" onClick={onCreateAccount}>
                                Create Account
                            </button>
                        </div>
                    </div>
                ) : (
                    // PROFILE VIEW
                    <>
                        <div className="profile-header">
                            <div className="profile-photo-lg">
                                {user.photoUrl ? (
                                    <img src={user.photoUrl} alt="Profile" />
                                ) : (
                                    <span>{user.name ? user.name.charAt(0) : 'N/A'}</span>
                                )}
                            </div>
                            <h3>{user.name}</h3>
                            <p className="status-label">Active User</p>
                        </div>

                        <div className="profile-details">
                            <div className="detail-row">
                                <span className="label">Phone</span>
                                <span className="value">{user.phone}</span>
                            </div>
                            <div className="detail-row">
                                <span className="label">Email</span>
                                <span className="value">{user.email}</span>
                            </div>
                            <div className="detail-row">
                                <span className="label">Address</span>
                                <span className="value">{user.address}</span>
                            </div>
                            <div className="detail-row">
                                <span className="label">Aadhar</span>
                                <span className="value">{user.aadhar}</span>
                            </div>
                            <div className="detail-row">
                                <span className="label">IMEI 1</span>
                                <span className="value">{user.imei1}</span>
                            </div>
                            <div className="detail-row">
                                <span className="label">IMEI 2</span>
                                <span className="value">{user.imei2}</span>
                            </div>
                        </div>

                        <div className="download-status">
                            <h4>Download Status</h4>
                            <div className="status-row">
                                <span>ATS APK</span>
                                <span className={`badge ${user.atsDownloaded? 'success' : 'pending'}`}>
                                    {user.atsDownloaded? 'Downloaded' : 'Pending'}
                                </span>
                            </div>
                            <div className="status-row">
                                <span>TRACIFY App</span>
                                <span className={`badge ${user.appDownloaded? 'success' : 'pending'}`}>
                                    {user.appDownloaded? 'Downloaded' : 'Pending'}
                                </span>
                            </div>
                        </div>
                        
                        <button className="glass-btn logout-btn" onClick={() => { onLogout(); onClose(); }}>
                            Logout
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};

export default ProfilePanel;
