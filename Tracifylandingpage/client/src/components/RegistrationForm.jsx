import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import '../css_file/RegistrationForm.css';

const RegistrationForm = ({ onSuccess }) => {
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        altWhatsapp: '', 
        email: '',
        aadhar: '', 
        address: '', 
        imei1: '', 
        imei2: ''
    });
    const [errors, setErrors] = useState({});
    const [photoData, setPhotoData] = useState(null); // Stores base64 string
    const [isCameraOpen, setIsCameraOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [serverError, setServerError] = useState('');

    const videoRef = useRef(null);
    const canvasRef = useRef(null);

    // Initialize camera when isCameraOpen becomes true
    useEffect(() => {
        let stream = null;
        let isMounted = true;

        const initCamera = async () => {
            if (isCameraOpen) {
                try {
                    const newStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
                    if (!isMounted) {
                        newStream.getTracks().forEach(track => track.stop());
                        return;
                    }
                    stream = newStream;
                    if (videoRef.current) {
                        videoRef.current.srcObject = stream;
                    }
                } catch (err) {
                    if (!isMounted) return;
                    console.error("Error accessing camera:", err);
                    setServerError("Could not access camera. Please allow camera permissions.");
                    setIsCameraOpen(false);
                }
            }
        };

        initCamera();

        return () => {
            isMounted = false;
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }
        };
    }, [isCameraOpen]);

    const startCamera = () => {
        setServerError('');
        setIsCameraOpen(true);
    };

    const stopCamera = () => {
        setIsCameraOpen(false);
    };

    const capturePhoto = () => {
        if (videoRef.current && canvasRef.current) {
            const context = canvasRef.current.getContext('2d');
            // Set canvas dimensions to match video
            canvasRef.current.width = videoRef.current.videoWidth;
            canvasRef.current.height = videoRef.current.videoHeight;

            // Draw video frame to canvas
            context.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);

            // Convert to base64
            const dataUrl = canvasRef.current.toDataURL('image/jpeg', 0.8);
            setPhotoData(dataUrl);
            stopCamera();
        }
    };

    const retakePhoto = () => {
        setPhotoData(null);
        startCamera();
    };

    const validateField = (name, value) => {
        let errorMsg = '';

        switch (name) {
            case 'name':
                if (value && !/^[A-Z]/.test(value)) {
                    errorMsg = 'Please start the name with a capital letter.';
                }
                break;
            case 'phone':
                if (value && !/^\d{10}$/.test(value)) {
                    errorMsg = 'Phone number must be exactly 10 digits.';
                }
                break;
            case 'altWhatsapp':
                if (value && !/^\d{10}$/.test(value)) {
                    errorMsg = 'Phone number must be exactly 10 digits.';
                } else if (value && value === formData.phone) {
                    errorMsg = 'Alternate WhatsApp number cannot be the same as the primary phone number.';
                }
                break;
            case 'email':
                if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                    errorMsg = 'Please enter a valid email address.';
                }
                break;
            case 'aadhar':
                if (value && !/^\d{12}$/.test(value)) {
                    errorMsg = 'Aadhar number must be exactly 12 digits.';
                }
                break;
            case 'imei1':
            case 'imei2':
                if (value && !/^\d{15}$/.test(value)) {
                    errorMsg = 'IMEI number must be exactly 15 digits.';
                }
                break;
            default:
                break;
        }

        setErrors(prev => {
            const newErrors = { ...prev };
            if (errorMsg) {
                newErrors[name] = errorMsg;
            } else {
                delete newErrors[name];
            }
            return newErrors;
        });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        validateField(name, value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Final validation check
        const hasErrors = Object.keys(errors).length > 0;
        if (hasErrors) {
            return;
        }

        if (!photoData) {
            setServerError("Please capture a photo.");
            return;
        }

        setLoading(true);
        setServerError('');

        try {
            // include captured photo as photoUrl so server receives it
            const payload = { ...formData, photoUrl: photoData };
            const res = await axios.post('http://localhost:5000/api/register', payload);
            onSuccess(res.data.userId);
        } catch (err) {
            setServerError(err.response?.data?.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="registration-container animate-fade-in" id="registration-form">
            <div className="glass-panel form-card">
                <h2>Register</h2>
                <p className="form-subtitle">Join Tracify today</p>

                {serverError && <div className="error-msg server-error">{serverError}</div>}

                <form onSubmit={handleSubmit} className="reg-form">
                    <div className="form-grid">
                        <div className="input-group">
                            <input
                                type="text"
                                name="name"
                                placeholder="Full Name"
                                required
                                className={`glass-input ${errors.name ? 'input-error' : ''}`}
                                onChange={handleChange}
                            />
                            {errors.name && <span className="field-error">{errors.name}</span>}
                        </div>

                        <div className="input-group">
                            <input
                                type="tel"
                                name="phone"
                                placeholder="Phone Number"
                                required
                                className={`glass-input ${errors.phone ? 'input-error' : ''}`}
                                onChange={handleChange}
                            />
                            {errors.phone && <span className="field-error">{errors.phone}</span>}
                        </div>

                        <div className="input-group">
                            <input
                                type="tel"
                                name="altWhatsapp"
                                placeholder="Alt WhatsApp"
                                className={`glass-input ${errors.altWhatsapp ? 'input-error' : ''}`}
                                onChange={handleChange}
                            />
                            {errors.altWhatsapp && <span className="field-error">{errors.altWhatsapp}</span>}
                        </div>

                        <div className="input-group">
                            <input
                                type="email"
                                name="email"
                                placeholder="Email Address"
                                required
                                className={`glass-input ${errors.email ? 'input-error' : ''}`}
                                onChange={handleChange}
                            />
                            {errors.email && <span className="field-error">{errors.email}</span>}
                        </div>

                        <div className="input-group">
                            <input
                                type="text"
                                name="aadhar"
                                placeholder="Aadhar Number"
                                required
                                className={`glass-input ${errors.aadhar ? 'input-error' : ''}`}
                                onChange={handleChange}
                            />
                            {errors.aadhar && <span className="field-error">{errors.aadhar}</span>}
                        </div>

                        <div className="input-group">
                            <input
                                type="text"
                                name="address"
                                placeholder="Full Address"
                                required
                                className="glass-input"
                                onChange={handleChange}
                            />
                        </div>

                        <div className="input-group">
                            <input
                                type="text"
                                name="imei1"
                                placeholder="IMEI 1"
                                required
                                className={`glass-input ${errors.imei1 ? 'input-error' : ''}`}
                                onChange={handleChange}
                            />
                            {errors.imei1 && <span className="field-error">{errors.imei1}</span>}
                        </div>

                        <div className="input-group">
                            <input
                                type="text"
                                name="imei2"
                                placeholder="IMEI 2"
                                required
                                className={`glass-input ${errors.imei2 ? 'input-error' : ''}`}
                                onChange={handleChange}
                            />
                            {errors.imei2 && <span className="field-error">{errors.imei2}</span>}
                        </div>
                    </div>

                    <div className="photo-section">
                        <label className="photo-label">Live Photo Capture</label>

                        {!isCameraOpen && !photoData && (
                            <button type="button" className="glass-btn camera-btn" onClick={startCamera}>
                                Click Photo 📸
                            </button>
                        )}

                        {isCameraOpen && (
                            <div className="camera-container">
                                <video ref={videoRef} autoPlay playsInline muted className="video-preview"></video>
                                <button type="button" className="glass-btn capture-btn" onClick={capturePhoto}>
                                    Capture
                                </button>
                            </div>
                        )}

                        {photoData && (
                            <div className="preview-container">
                                <img src={photoData} alt="Captured" className="photo-preview" />
                                <button type="button" className="glass-btn retake-btn" onClick={retakePhoto}>
                                    Retake
                                </button>
                            </div>
                        )}

                        <canvas ref={canvasRef} style={{ display: 'none' }}></canvas>
                    </div>

                    <button
                        type="submit"
                        className="glass-btn primary-btn submit-btn"
                        disabled={loading || Object.keys(errors).length > 0 || !photoData}
                    >
                        {loading ? 'Registering...' : 'Submit Registration'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default RegistrationForm;
