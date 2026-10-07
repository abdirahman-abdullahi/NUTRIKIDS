const db = require('../config/db');

exports.addMealPlan = async (req, res) => {
    const { child_id, breakfast_item, breakfast_drink, lunch_item, lunch_drink, dinner_item, dinner_drink } = req.body;
    try {
        await db.query(
            'INSERT INTO MealPlans (child_id, breakfast_item, breakfast_drink, lunch_item, lunch_drink, dinner_item, dinner_drink) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [child_id, breakfast_item, breakfast_drink, lunch_item, lunch_drink, dinner_item, dinner_drink]
        );
        res.status(201).json({ message: 'Meal plan added successfully' });
    } catch (error) {
        console.error('Failed to add meal plan:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};


exports.getMealPlansByChildId = async (req, res) => {
    const { child_id } = req.params;
    try {
        const query = `
        SELECT mp.*, 
               b.name as breakfast_item_name, bd.name as breakfast_drink_name,
               l.name as lunch_item_name, ld.name as lunch_drink_name,
               d.name as dinner_item_name, dd.name as dinner_drink_name
        FROM MealPlans mp
        LEFT JOIN Foods b ON mp.breakfast_item = b.food_id
        LEFT JOIN Foods bd ON mp.breakfast_drink = bd.food_id
        LEFT JOIN Foods l ON mp.lunch_item = l.food_id
        LEFT JOIN Foods ld ON mp.lunch_drink = ld.food_id
        LEFT JOIN Foods d ON mp.dinner_item = d.food_id
        LEFT JOIN Foods dd ON mp.dinner_drink = dd.food_id
        WHERE mp.child_id = ?;
        `;
        const [mealPlans] = await db.query(query, [child_id]);

        if (mealPlans.length === 0) {
            return res.status(404).json({ message: 'No meal plans found for this child' });
        }

        res.json(mealPlans);
    } catch (error) {
        console.error('Error fetching meal plans:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};