const request = require('supertest');
const express = require('express');
const db = require('../config/db'); // Import your database config
const nutritionController = require('../controllers/nutritionController');

const app = express();
app.use(express.json());
app.post('/addFood', nutritionController.addFood);
app.get('/foods', nutritionController.getAllFoods);
app.get('/foods/category/:category', nutritionController.getFoodsByCategory);
app.put('/foods/:id', nutritionController.updateFood);
app.delete('/foods/:id', nutritionController.deleteFood);

// Mock database
jest.mock('../config/db');

describe('Nutrition Controller', () => {
    afterEach(() => {
        jest.clearAllMocks(); // Clear mock calls after each test
    });

    test('should add a food item successfully', async () => {
        db.query.mockResolvedValueOnce([{ insertId: 1 }]); // Mock successful insertion
        const response = await request(app).post('/addFood').send({
            name: 'Test Food',
            category: 'Vegetable',
            calories: 50,
            protein: 1,
            carbohydrates: 10,
            fats: 0,
            fiber: 2,
            sugar: 1,
            vitamin_a: 100,
            vitamin_c: 20,
            calcium: 10,
            iron: 1
        });

        expect(response.status).toBe(201);
        expect(response.body.message).toBe('Food added successfully');
        expect(response.body.foodId).toBe(1);
    });

    test('should return 500 on error adding food', async () => {
        db.query.mockRejectedValueOnce(new Error('Database error')); // Simulate error
        const response = await request(app).post('/addFood').send({
            name: 'Test Food',
            category: 'Vegetable',
            calories: 50,
            protein: 1,
            carbohydrates: 10,
            fats: 0,
            fiber: 2,
            sugar: 1,
            vitamin_a: 100,
            vitamin_c: 20,
            calcium: 10,
            iron: 1
        });

        expect(response.status).toBe(500);
        expect(response.body.message).toBe('Server error');
    });

    test('should get all food items successfully', async () => {
        db.query.mockResolvedValueOnce([[{ id: 1, name: 'Test Food', category: 'Vegetable' }]]); // Simulate existing foods
        const response = await request(app).get('/foods');

        expect(response.status).toBe(200);
        expect(response.body).toEqual(expect.arrayContaining([expect.objectContaining({ id: 1, name: 'Test Food', category: 'Vegetable' })]));
    });

    test('should return 500 on error retrieving all foods', async () => {
        db.query.mockRejectedValueOnce(new Error('Database error')); // Simulate error
        const response = await request(app).get('/foods');

        expect(response.status).toBe(500);
        expect(response.body.message).toBe('Server error');
    });

    test('should get foods by category successfully', async () => {
        db.query.mockResolvedValueOnce([[{ id: 1, name: 'Test Food', category: 'Vegetable' }]]); // Simulate existing foods in category
        const response = await request(app).get('/foods/category/Vegetable');

        expect(response.status).toBe(200);
        expect(response.body).toEqual(expect.arrayContaining([expect.objectContaining({ id: 1, name: 'Test Food', category: 'Vegetable' })]));
    });

    test('should return 500 on error retrieving foods by category', async () => {
        db.query.mockRejectedValueOnce(new Error('Database error')); // Simulate error
        const response = await request(app).get('/foods/category/Vegetable');

        expect(response.status).toBe(500);
        expect(response.body.message).toBe('Server error');
    });

    test('should update a food item successfully', async () => {
        db.query.mockResolvedValueOnce([{ affectedRows: 1 }]); // Mock successful update
        const response = await request(app).put('/foods/1').send({
            name: 'Updated Food',
            category: 'Fruit',
            calories: 60,
            protein: 2,
            carbohydrates: 12,
            fats: 1,
            fiber: 3,
            sugar: 2,
            vitamin_a: 200,
            vitamin_c: 30,
            calcium: 20,
            iron: 2
        });

        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Food updated successfully');
    });

    test('should return 404 if food not found during update', async () => {
        db.query.mockResolvedValueOnce([{ affectedRows: 0 }]); // Simulate food not found
        const response = await request(app).put('/foods/999').send({
            name: 'Non-existent Food'
        });

        expect(response.status).toBe(404);
        expect(response.body.message).toBe('Food not found');
    });

    test('should return 500 on error during food update', async () => {
        db.query.mockRejectedValueOnce(new Error('Database error')); // Simulate error
        const response = await request(app).put('/foods/1').send({
            name: 'Updated Food'
        });

        expect(response.status).toBe(500);
        expect(response.body.message).toBe('Server error');
    });

    test('should delete a food item successfully', async () => {
        db.query.mockResolvedValueOnce([{ affectedRows: 1 }]); // Mock successful deletion
        const response = await request(app).delete('/foods/1');

        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Food deleted successfully');
    });

    test('should return 404 if food not found during deletion', async () => {
        db.query.mockResolvedValueOnce([{ affectedRows: 0 }]); // Simulate food not found
        const response = await request(app).delete('/foods/999');

        expect(response.status).toBe(404);
        expect(response.body.message).toBe('Food not found');
    });

    test('should return 500 on error during food deletion', async () => {
        db.query.mockRejectedValueOnce(new Error('Database error')); // Simulate error
        const response = await request(app).delete('/foods/1');

        expect(response.status).toBe(500);
        expect(response.body.message).toBe('Server error');
    });
});