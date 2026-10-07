// backend/controllers/authController.js
const bcrypt = require('bcryptjs');
const db = require('../config/db');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        // Check if the email already exists
        const [existingUser] = await db.query('SELECT email FROM users WHERE email = ?', [email]);

        if (existingUser.length > 0) {
            return res.status(400).json({ message: 'Email already in use' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert the user into the database
        await db.query('INSERT INTO users (name, email, password) VALUES (?, ?, ?)', 
                       [name, email, hashedPassword]);

        res.status(201).json({ message: 'User registered successfully. You can now log in.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const [user] = await db.query('SELECT * FROM users WHERE email = ?', [email]);

        if (user.length === 0 || !(await bcrypt.compare(password, user[0].password))) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ userId: user[0].id }, 'your_jwt_secret', { expiresIn: '1h' });
        res.status(200).json({ token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.updateProfile = async (req, res) => {
    const { email, password } = req.body;
    const userId = req.user.userId; // Assuming you have the user ID from the auth middleware

    try {
        if (email) {
            await db.query('UPDATE users SET email = ? WHERE id = ?', [email, userId]);
        }

        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10);
            await db.query('UPDATE users SET password = ? WHERE id = ?', [hashedPassword, userId]);
        }

        res.status(200).json({ message: 'Profile updated successfully.' });
    } catch (error) {
        console.error('Error updating profile:', error);
        res.status(500).json({ message: 'Server error' });
    }
};