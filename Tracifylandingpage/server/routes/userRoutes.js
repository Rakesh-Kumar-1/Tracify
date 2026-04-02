const express = require('express');
const router = express.Router();
const Download = require('../models/Download');
const User = require('../models/User');
const Credential = require('../models/Credential');
const bcrypt = require('bcryptjs');

// 1. Register User (Step 1)
router.post('/register', async (req, res) => {
    try {
        const { name, phone, altWhatsapp, email, aadhar, address, imei1, imei2, photoUrl } = req.body;

        // Check if user already exists
        let existingUser= await User.findOne({ email });

        if (existingUser) {
            return res.status(404).json({ message: 'User with this email already exists' });
        }
        else {
            const newUser = new User({
                name, phone, altWhatsapp, email, aadhar, address, imei1, imei2, photoUrl
            });
            const savedUser = await newUser.save();
            return res.status(201).json({ message: 'Registration successful', userId: savedUser._id });
        }
    } catch (error) {
        console.error('Registration Error:', error);
        return res.status(500).json({ message: 'Server error during registration' });
    }
});

// 2. Create Credentials (Step 2)
router.post('/create-credentials', async (req, res) => {
    try {
        const { userId, password } = req.body;
        if (!userId || !password) {
            return res.status(400).json({ message: 'Missing required fields' });
        }
        const passwordHash = await bcrypt.hash(password, 10);
        const credentials = new Credential({userId,passwordHash});
        const downloads = new Download({userId, atsDownloaded: false, appDownloaded: false});
        
        await credentials.save();
        await downloads.save();
        return res.status(200).json({ message: 'Credentials created successfully' });
    } catch (error) {
        console.error('Credential Creation Error:', error);
        res.status(500).json({ message: 'Server error: ' + error.message });
    }
});

// 3. Get User Profile
router.get('/user/:id', async (req, res) => {
    try {
        const id = req.params.id;

        const user = await User.findById(id).lean();
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const downloads = await Download.findOne({ userId: id })
            .select('atsDownloaded appDownloaded -_id').lean();

        const response = {
            ...user,
            atsDownloaded: downloads?.atsDownloaded ?? false,
            appDownloaded: downloads?.appDownloaded ?? false
        };

        return res.status(200).json({response});

    } catch (error) {
        console.error('Fetch User Error:', error);
        return res.status(500).json({ message: 'Server error' });
    }
});

// 4. Mark Download
router.post('/mark-download', async (req, res) => {
    let download;
    try {
        const { userId, type } = req.body; // type: 'ats' or 'app'
        if (!userId || !type) {
            return res.status(400).json({ message: 'Missing userId or type' });
        }

        download = await Download.findOne({userId});

        if (!download) {
            download = new Download({ userId });
        }

        if (type === 'ats') download.atsDownloaded = true;
        if (type === 'app') download.appDownloaded = true;

        await download.save();
        return res.status(200).json({ message: 'Download status updated' });
    } catch (error) {
        console.error('Mark Download Error:', error);
        return res.status(500).json({ message: 'Server error' });
    }
});

// 5. Login User
router.post('/login', async (req, res) => {
    let credentials;
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ message: 'Missing username or password' });
        }else{
            credentials = await Credential.findOne({userId: username});
        }

        if (!credentials) {
            return res.status(400).json({ message: 'You are not a Tracify user. Please register first.' });
        }

        // Verify password
        const isMatch = bcrypt.compare(password, credentials.passwordHash);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        return res.status(200).json({ message: 'Login successful', userId: credentials.userId });
    } catch (error) {
        console.error('Login Error:', error);
        return res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;


