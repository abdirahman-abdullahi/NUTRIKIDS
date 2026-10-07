const express = require('express');
const router = express.Router();
const { register, login , updateProfile} = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/register', register);
router.post('/login', login);
router.get('/user', authMiddleware, async (req, res) => {
    res.json(req.user);  // Now this should return the full user data with role
});
router.put('/update-profile', authMiddleware, updateProfile);

module.exports = router;