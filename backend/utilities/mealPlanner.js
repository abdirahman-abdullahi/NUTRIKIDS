// mealPlanner.js
const db = require('../config/db');

// Calculate daily nutritional needs based on child's age, weight, and height
function calculateNutritionalNeeds(age, weight, height) {
    // Example constants for Basal Metabolic Rate calculation adjusted for children
    const BMR = 10 * weight + 6.25 * height - 5 * age + (age < 10 ? +5 : -161);
    const dailyCalories = BMR * 1.2; // Assuming low activity level

    return {
        calories: dailyCalories,
        protein: dailyCalories * 0.1 / 4, // 10% of daily calories from protein
        fats: dailyCalories * 0.25 / 9, // 25% from fats
        carbohydrates: dailyCalories * 0.65 / 4 // 65% from carbs
    };
}

// Function to generate a meal plan based on nutritional needs
async function generateMealPlan(childId) {
    const { age, weight, height } = await getChildDetails(childId);
    const needs = calculateNutritionalNeeds(age, weight, height);

    // Select foods that match nutritional needs
    const query = `
        SELECT * FROM Foods 
        WHERE calories <= ${needs.calories} 
          AND protein <= ${needs.protein} 
          AND fats <= ${needs.fats} 
          AND carbohydrates <= ${needs.carbohydrates}
        ORDER BY RAND() 
        LIMIT 3;  // Get a sample meal plan with 3 items
    `;
    const [foods] = await db.query(query);
    return foods;
}

async function getChildDetails(childId) {
    const [result] = await db.query('SELECT age, weight, height FROM Children WHERE child_id = ?', [childId]);
    if (result.length === 0) throw new Error('Child not found');
    return result[0];
}

module.exports = { generateMealPlan };