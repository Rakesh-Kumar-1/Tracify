const express = require('express');
const router = express.Router();
const Download = require('../models/Download');
const User = require('../models/User');
const Credential = require('../models/Credential');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authenticateToken = require('../middleware/authentication');
const dotenv = require('dotenv');
const createError = require('../utils/createError');
dotenv.config();


// 1. Login User
router.post('/login', async (req, res,next) => {
    let credentials;
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return next(createError('Missing username or password', 400));
        }else{
            credentials = await Credential.findOne({userId: username});
        }

        if (!credentials) {
            return next(createError('You are not a Tracify user. Please register first.', 400));
        }

        // Verify password
        const isMatch = await bcrypt.compare(password, credentials.passwordHash);
        if (!isMatch) {
            return next(createError('Invalid credentials', 400));
        }
        const token = jwt.sign({ username }, 'tracify_2026_4_member ', { expiresIn: '7d' });
         res.cookie('token', token, {
            httpOnly: true,
            secure: false, // true in production (HTTPS)
            sameSite: 'lax'
        });
        return res.status(200).json({ message: 'Login successful', userId: credentials.userId });
    } catch (error) {
        console.error('Login Error:', error);
        return next(createError('Server error during login', 500));
    }
});

// 1. Register User (Step 1)
router.post('/register', async (req, res,next) => {
    try {
        const { name, phone, altWhatsapp, email, aadhar, address, imei1, imei2, photoUrl } = req.body;

        // Check if user already exists
        let existingUser= await User.findOne({ email });

        if (existingUser) {
            return next(createError('User with this email already exists', 400));
        }
        else {
            const newUser = new User({name, phone, altWhatsapp, email, aadhar, address, imei1, imei2, photoUrl});
            const savedUser = await newUser.save();
            return res.status(201).json({ message: 'Registration successful', userId: savedUser._id });
        }
    } catch (error) {
        console.error('Registration Error:', error);
        return next(createError('Server error during registration', 500));
    }
});

// 2. Create Credentials (Step 2)
router.post('/create-credentials', async (req, res,next) => {
    try {
        const { userId, password } = req.body;
        if (!userId || !password) {
            return next(createError('Missing required fields', 400));
        }
        const passwordHash = await bcrypt.hash(password, 10);
        const credentials = new Credential({userId,passwordHash});
        const downloads = new Download({userId, atsDownloaded: false, appDownloaded: false});
        
    await credentials.save();
    await downloads.save();
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.cookie('token',token);
    return res.status(200).json({ message: 'Credentials created successfully' });
    } catch (error) {
        console.error('Credential Creation Error:', error);
        return next(createError('Server error', 500));
    }
});

// 3. Get User Profile
router.get('/user', authenticateToken, async (req, res,next) => {
    try {
        const id = req.authId;
        console.log('Fetching profile for user ID:', id); // Debugging log
        const user = await User.findById(id).lean();
        if (!user) {
            return next(createError('User not found', 404));
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
        return next(createError('Server error', 500));
    }
});

// 4. Mark Download
router.get('/mark-download', authenticateToken, async (req, res,next) => {
    let download;
    try {
        const userId = req.authId;
        const { type } = req.query; // type: 'ats' or 'app'
        if (!userId || !type) {
            return next(createError('Missing userId or type', 400));
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
        return next(createError('Server error', 500));
    }
});

router.get('/logout',authenticateToken, async (req,res,next) => {
    try{
        res.clearCookie('token', {
            httpOnly: true,
            secure: false, // true in production (HTTPS)
            sameSite: 'lax'
        });
        return res.status(200).json({ message: 'Logout successful' });
    }catch(err){
        return next(createError('Server error', 500));
    }
})
module.exports = router;


