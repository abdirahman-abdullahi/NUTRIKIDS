const jwt = require('jsonwebtoken');
const db = require('../config/db');

const authMiddleware = async (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }

    try {
        const decoded = jwt.verify(token, 'your_jwt_secret');
        const [user] = await db.query('SELECT * FROM users WHERE id = ?', [decoded.userId]);
        if (user.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }
        req.user = {
            ...user[0],
            userId: user[0].id  // Ensure this line is here to explicitly set userId
        };
        next();
    } catch (error) {
        return res.status(403).json({ message: 'Invalid token', error: error.message });
    }
};

module.exports = authMiddleware;