import React, { useState } from 'react';
import axios from 'axios';
import '../css_file/CreateCredentialsForm.css';

const CreateCredentialsForm = ({ userId, onSuccess }) => {
    const [formData, setFormData] = useState({
        username: '', 
        password: '', 
        confirmPassword: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            setError("Passwords don't match");
            return;
        }
        if(formData.username !== userId){
            setError("Username must match the provided User ID");
            return;
        }
        setLoading(true);
        setError('');

        try {
            const res = await axios.post('http://localhost:5000/api/create-credentials', {
                userId,
                password: formData.password
            });
            if(res.status === 200){
                onSuccess();
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create credentials');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="center-screen animate-fade-in">
            <div className="glass-panel cred-card">
                <h2>Create Credentials</h2>
                <p className="form-subtitle">Secure your account</p>

                {error && <div className="error-msg">{error}</div>}

                <form onSubmit={handleSubmit} className="cred-form">
                    <h3>Your User Id is below type it with no mistake:</h3>
                    <h5>{userId}</h5>
                    <input type="text" name="username" placeholder="Create User ID" required className="glass-input" onChange={handleChange} />
                    <input type="password" name="password" placeholder="Create Password" required className="glass-input" onChange={handleChange} />
                    <input type="password" name="confirmPassword" placeholder="Confirm Password" required className="glass-input" onChange={handleChange} />

                    <button type="submit" className="glass-btn primary-btn submit-btn" disabled={loading}>
                        {loading ? 'Creating...' : 'Create Account'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CreateCredentialsForm;
