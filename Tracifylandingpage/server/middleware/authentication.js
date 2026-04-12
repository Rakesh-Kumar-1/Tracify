const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const authenticateToken = async (req, res, next) => {
    try {
        let token = req.cookies?.token || null;

        if (!token) {
            return res.status(401).json({ message: 'No token provided' });
        }
        console.log(req.cookies);
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('Decoded JWT:', decoded);
        req.authId = decoded.username;
        next();
    } catch (err) {
        console.error('Authentication error:', err.message || err);
        return res.status(401).json({ message: 'Invalid or expired token' });
    }
};

module.exports = authenticateToken;