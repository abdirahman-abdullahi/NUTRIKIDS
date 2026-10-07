const request = require('supertest');
const express = require('express');
const db = require('../config/db'); // Import your database config
const mealPlanController = require('../controllers/mealPlanController');

const app = express();
app.use(express.json());
app.post('/addMealPlan', mealPlanController.addMealPlan);
app.get('/mealPlans/:child_id', mealPlanController.getMealPlansByChildId);

// Mock database
jest.mock('../config/db');

describe('Meal Plan Controller', () => {
    afterEach(() => {
        jest.clearAllMocks(); // Clear mock calls after each test
    });

    test('should add a meal plan successfully', async () => {
        const response = await request(app).post('/addMealPlan').send({
            child_id: 1,
            breakfast_item: '1',
            breakfast_drink: '2',
            lunch_item: '3',
            lunch_drink: '4',
            dinner_item: '5',
            dinner_drink: '6'
        });

        expect(response.status).toBe(201);
        expect(response.body.message).toBe('Meal plan added successfully');
        expect(db.query).toHaveBeenCalledTimes(1); // Check that db.query was called once
    });

    test('should return 500 on error during meal plan addition', async () => {
        db.query.mockRejectedValueOnce(new Error('Database error')); // Simulate error
        const response = await request(app).post('/addMealPlan').send({
            child_id: 1,
            breakfast_item: '1',
            breakfast_drink: '2',
            lunch_item: '3',
            lunch_drink: '4',
            dinner_item: '5',
            dinner_drink: '6'
        });

        expect(response.status).toBe(500);
        expect(response.body.message).toBe('Server error');
    });

    test('should return meal plans for the specified child ID', async () => {
        db.query.mockResolvedValueOnce([[{
            child_id: 1,
            breakfast_item: '1',
            breakfast_drink: '2',
            lunch_item: '3',
            lunch_drink: '4',
            dinner_item: '5',
            dinner_drink: '6'
        }]]); // Simulate existing meal plans

        const response = await request(app).get('/mealPlans/1');

        expect(response.status).toBe(200);
        expect(response.body).toEqual(expect.arrayContaining([expect.objectContaining({
            child_id: 1
        })]));
    });

    test('should return 404 if no meal plans found for the child ID', async () => {
        db.query.mockResolvedValueOnce([[]]); // Simulate no meal plans found
        const response = await request(app).get('/mealPlans/1');

        expect(response.status).toBe(404);
        expect(response.body.message).toBe('No meal plans found for this child');
    });

    test('should return 500 on error fetching meal plans', async () => {
        db.query.mockRejectedValueOnce(new Error('Database error')); // Simulate error
        const response = await request(app).get('/mealPlans/1');

        expect(response.status).toBe(500);
        expect(response.body.message).toBe('Server error');
    });
});