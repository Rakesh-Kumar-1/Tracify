import React from 'react';
import '../css_file/Navbar.css';

const Navbar = ({ onProfileClick, user, onHomeClick }) => {
    return (
        <nav className="navbar glass-panel">
            <div className="navbar-left">
                <img src="/logoxy.png" alt="Tracify Logo" className="navbar-logo" />
                <span className="navbar-brand">TRACIFY</span>
            </div>
            <div className="navbar-right">
                <button className="home-btn glass-btn" onClick={onHomeClick}>HOME</button>
                <button className="profile-btn glass-btn" onClick={onProfileClick}>
                    <div className="profile-icon">
                        {user && user.photoUrl ? (
                            // <img src={user.photoUrl} alt="Profile" className="profile-img-small" /> 
                            <span className="profile-default-icon">{user.name.charAt(0)}</span>   
                        ) : (
                            <span className="profile-default-icon">👤</span>
                        )}
                    </div>
                </button>
            </div>
        </nav>
    );
};

export default Navbar;
