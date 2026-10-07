// backend/controllers/nutritionController.js

const db = require('../config/db');

// Add new food item
exports.addFood = async (req, res) => {
    const { name, category, calories, protein, carbohydrates, fats, fiber, sugar, vitamin_a, vitamin_c, calcium, iron } = req.body;
    try {
        const [result] = await db.query('INSERT INTO foods (name, category, calories, protein, carbohydrates, fats, fiber, sugar, vitamin_a, vitamin_c, calcium, iron) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ? )', 
                                        [name, category, calories, protein, carbohydrates, fats, fiber, sugar, vitamin_a, vitamin_c, calcium, iron]);
        res.status(201).json({ message: 'Food added successfully', foodId: result.insertId });
    } catch (error) {
        console.error('Failed to add food:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get all food items
exports.getAllFoods = async (req, res) => {
    try {
        const [foods] = await db.query('SELECT * FROM foods');
        res.status(200).json(foods);
    } catch (error) {
        console.error('Failed to retrieve foods:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
exports.getFoodsByCategory = async (req, res) => {
    const { category } = req.params; // category is passed as a URL parameter
    try {
        const [foods] = await db.query('SELECT * FROM foods WHERE category = ?', [category]);
        res.status(200).json(foods);
    } catch (error) {
        console.error('Failed to retrieve foods by category:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
// Update a food item
exports.updateFood = async (req, res) => {
    const { id } = req.params;
    const { name, category, calories, protein, carbohydrates, fats, fiber, sugar, vitamin_a, vitamin_c, calcium, iron } = req.body;
    try {
        const [result] = await db.query('UPDATE foods SET name = ?, category = ?, calories = ?, protein = ?, carbohydrates = ?, fats = ?, fiber = ?, sugar = ?, vitamin_a = ?, vitamin_c = ?, calcium = ?, iron = ?, WHERE id = ?', 
                                        [name, category, calories, protein, carbohydrates, fats, fiber, sugar, vitamin_a, vitamin_c, calcium, iron, id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Food not found' });
        }
        res.status(200).json({ message: 'Food updated successfully' });
    } catch (error) {
        console.error('Failed to update food:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Delete a food item
exports.deleteFood = async (req, res) => {
    const { id } = req.params;
    try {
        const [result] = await db.query('DELETE FROM foods WHERE id = ?', [id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Food not found' });
        }
        res.status(200).json({ message: 'Food deleted successfully' });
    } catch (error) {
        console.error('Failed to delete food:', error);
        res.status(500).json({ message: 'Server error' });
    }
};