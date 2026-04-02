import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from './components/Navbar';
import HeroDownloads from './components/HeroDownloads';
import RegistrationForm from './components/RegistrationForm';
import CreateCredentialsForm from './components/CreateCredentialsForm';
import WelcomePopup from './components/WelcomePopup';
import ProfilePanel from './components/ProfilePanel';
import './index.css';

function App() {
  const [user, setUser] = useState(null);
  const [userId, setUserId] = useState(localStorage.getItem('tracify_userId') || null);
  const [showWelcome, setShowWelcome] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [view, setView] = useState('home'); // 'home', 'credentials'
  useEffect(() => {
    if (userId) {
      fetchUser(userId);
    }
  }, [userId]);

  const fetchUser = async (id) => {
    try {
      const res = await axios.get(`http://localhost:5000/api/user/${id}`);
      setUser(res.data.response);
      // If user has no username, they need to create credentials
      if (!res.data.response.name) {
        // If we just registered (showWelcome might be true), we wait for popup close
        // If we refreshed and are pending credentials, go to credentials view
        if (!showWelcome) {
          // We might want to stay on home if they haven't finished reg, but reg is finished if we have userId.
          // So if no username, they are in step 2.
          // However, let's control this via the flow.
        }
      }
    } catch (err) {
      console.error("Failed to fetch user", err);
      // If 404, maybe clear localStorage
      if (err.response && err.response.status === 404) {
        localStorage.removeItem('tracify_userId');
        setUserId(null);
        setUser(null);
      }
    }
  };

  const handleRegistrationSuccess = (newUserId) => {
    setUserId(newUserId);
    localStorage.setItem('tracify_userId', newUserId);
    setShowWelcome(true);
  };

  const handleWelcomeClose = () => {
    setShowWelcome(false);
    setView('credentials');
  };

  const handleCredentialsSuccess = () => {
    // Refresh user to get updated status (username set)
    fetchUser(userId);
    setView('home');
    alert("Account Created Successfully!");
  };

  const handleLogin = (id) => {
    setUserId(id);
    localStorage.setItem('tracify_userId', id);
    // fetchUser will trigger via useEffect
  };

  const handleLogout = () => {
    setUserId(null);
    setUser(null);
    localStorage.removeItem('tracify_userId');
    setView('home');
  };

  const handleHomeClick = () => {
    setView('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCreateAccount = () => {
    setShowProfile(false);
    setView('home');
    setTimeout(() => {
      document.getElementById('registration-form')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleDownload = async (type) => {
    const apkUrl = `${import.meta.env.BASE_URL}Sample.apk`;
    const appUrl = `${import.meta.env.BASE_URL}Sample.apk`;
    const link = document.createElement("a");

    // Mark download in backend
    if (user) {
      console.log(user);
      try {
        const res = await axios.post('http://localhost:5000/api/mark-download', {
          userId: user._id,
          type
        });
        // Refresh user to update badges
        if(res.data.message === 'Download status updated'){
          alert(`Downloading ${type === 'ats' ? 'ATS APK' : 'TRACIFY App'}...`);
          // Trigger actual download (mock)
          if(type === 'ats'){
            link.href = apkUrl;
            link.download = "Tracify-A-Secure-App.apk"; // Suggested filename
            document.body.appendChild(link);
            link.click();
            setUser(prev => ({...prev, atsDownloaded: true}));
            console.log(user);
          }else{
            link.href = appUrl;
            link.download = "TRACIFY-App.apk"; // Suggested filename
            document.body.appendChild(link);
            link.click();
            setUser(prev => ({...prev, appDownloaded: true}));
          }
          document.body.removeChild(link);
        }
      } catch (err) {
        console.error("Failed to mark download", err);
      }
    }
  };

  return (
    <div className="app">
      <Navbar user={user} onProfileClick={() => setShowProfile(true)} onHomeClick={handleHomeClick} />

      {view === 'home' && (
        <>
          <HeroDownloads user={user} onDownload={handleDownload} />

          {/* Show Registration Form if user is not fully registered */}
          {(!user || !user.username) && (
            <RegistrationForm onSuccess={handleRegistrationSuccess} />
          )}
        </>
      )}

      {view === 'credentials' && (
        <CreateCredentialsForm userId={userId} onSuccess={handleCredentialsSuccess} />
      )}

      {showWelcome && (
        <WelcomePopup onClose={handleWelcomeClose} />
      )}

      {showProfile && (
        <ProfilePanel
          user={user}
          onClose={() => setShowProfile(false)}
          onLogin={handleLogin}
          onLogout={handleLogout}
          onCreateAccount={handleCreateAccount}
        />
      )}
    </div>
  );
}

export default App;
