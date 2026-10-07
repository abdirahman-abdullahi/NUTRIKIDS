const express = require('express');
const router = express.Router();
const { addChild, getChildren } = require('../controllers/childController');
const db = require('../config/db'); // Import your db configuration
const authMiddleware = require('../middleware/authMiddleware');

router.post('/register-child', authMiddleware, addChild);
router.get('/get-children', authMiddleware, getChildren);
/*router.get('/get-children', authMiddleware, async (req, res) => {
    const parentId = req.user.id;  // Get parent ID from the req.user object

    if (!parentId) {
        console.log('Parent ID is missing in the token!');
        return res.status(400).json({ message: 'Parent ID is missing' });
    }

    console.log('Parent ID:', parentId);  // Ensure we're getting the correct parentId

    try {
        const [children] = await db.query('SELECT * FROM children WHERE parent_id = ?', [parentId]);
        if (children.length === 0) {
            console.log('No children found for this parent');
            return res.status(404).json({ message: 'No children found' });
        }
        console.log('Children found:', children);
        res.json(children);
    } catch (error) {
        console.error('Error fetching children:', error);
        res.status(500).json({ message: 'Server error' });
    }
});*/

module.exports = router;