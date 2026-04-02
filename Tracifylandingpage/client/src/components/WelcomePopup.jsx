import React from 'react';
import '../css_file/WelcomePopup.css';

const WelcomePopup = ({ onClose }) => {
    return (
        <div className="popup-overlay animate-fade-in">
            <div className="glass-panel popup-card">
                <div className="popup-icon">🎉</div>
                <h2>Welcome to Tracify!</h2>
                <p>Your registration was successful.</p>
                <p>Next step: Create your secure User ID and Password.</p>
                <button className="glass-btn primary-btn" onClick={onClose}>
                    Proceed to Create Credentials
                </button>
            </div>
        </div>
    );
};

export default WelcomePopup;
