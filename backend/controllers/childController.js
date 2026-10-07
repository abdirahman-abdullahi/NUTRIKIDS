const db = require('../config/db');

exports.addChild = async (req, res) => {
    const { childName, dob, weight, height } = req.body;
    const parentId = req.user.userId;  // Ensure this matches with the `authMiddleware` user object

    if (!parentId) {
        return res.status(400).json({ message: 'Parent ID is missing' });
    }

    try {
        await db.query(
            'INSERT INTO children (parent_id, child_name, dob, weight, height) VALUES (?, ?, ?, ?, ?)', 
            [parentId, childName, dob, weight, height]
        );
        res.status(201).json({ message: 'Child registered successfully' });
    } catch (error) {
        console.error('Error during child registration:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getChildren = async (req, res) => {
    const parentId = req.user.id; // Fetch the parent ID from authenticated user data
    try {
        const [children] = await db.query('SELECT * FROM children WHERE parent_id = ?', [parentId]);
        if (children.length === 0) {
            return res.status(404).json({ message: 'No children found' });
        }
        res.json(children);
    } catch (error) {
        console.error('Error fetching children:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
