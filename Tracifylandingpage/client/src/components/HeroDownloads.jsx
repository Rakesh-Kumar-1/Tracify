import React from 'react';
import '../css_file/HeroDownloads.css';

const HeroDownloads = ({ user, onDownload }) => {
    let isAtsUnlocked = false;
    if(user){
        isAtsUnlocked = true;
    }

    return (
        <div className="hero-container animate-fade-in">
            <div className="glass-panel hero-card">
                <h1 className="hero-title">Download Tracify</h1>
                <p className="hero-subtitle">Your Security. Your Control. Powered by Tracify.</p>

                <div className="downloads-grid">
                    {/* TRACIFY App - Always Available */}
                    <div className="download-item glass-panel">
                        <div className="icon-box app-icon">App</div>
                        <h3>TRACIFY App</h3>
                        <p>Secure Your Device</p>
                        <button
                            className="glass-btn primary-btn"
                            onClick={() => onDownload('app')}
                        >
                            Download Now
                        </button>
                    </div>

                    {/* ATS APK - Conditional */}
                    <div className={`download-item glass-panel ${!isAtsUnlocked ? 'locked' : ''}`}>
                        <div className="icon-box ats-icon">ATS</div>
                        <h3>ATS APK</h3>
                        <p>Advanced Tracking System</p>
                        {isAtsUnlocked ? (
                            <button
                                className="glass-btn primary-btn"
                                onClick={() => onDownload('ats')}
                            >
                                Download APK
                            </button>
                        ) : (
                            <div className="locked-msg">
                                <button className="glass-btn" disabled>Locked</button>
                                <small>Complete registration to unlock</small>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HeroDownloads;
