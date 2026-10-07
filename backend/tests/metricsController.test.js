const request = require('supertest');
const express = require('express');
const db = require('../config/db'); // Import your database config
const metricsController = require('../controllers/metricsController');

const app = express();
app.use(express.json());
app.post('/addOrUpdateMetrics', metricsController.addOrUpdateMetrics);
app.get('/metrics/:child_id', metricsController.getMetricsByChildId);

// Mock database
jest.mock('../config/db');

describe('Metrics Controller', () => {
    afterEach(() => {
        jest.clearAllMocks(); // Clear mock calls after each test
    });

    test('should add or update metrics successfully', async () => {
        const response = await request(app).post('/addOrUpdateMetrics').send({
            child_id: 1,
            date_recorded: '2024-10-01',
            height: 120,
            weight: 30
        });

        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Metrics updated successfully');
        expect(db.query).toHaveBeenCalledTimes(2); // Check that db.query was called twice (delete + insert)
    });

    test('should return 500 on error during metrics addition or update', async () => {
        db.query.mockRejectedValueOnce(new Error('Database error')); // Simulate error
        const response = await request(app).post('/addOrUpdateMetrics').send({
            child_id: 1,
            date_recorded: '2024-10-01',
            height: 120,
            weight: 30
        });

        expect(response.status).toBe(500);
        expect(response.body.message).toBe('Server error');
    });

    test('should return metrics for the specified child ID', async () => {
        db.query.mockResolvedValueOnce([[{
            height: 120,
            weight: 30,
            bmi: '20.83',
            date_recorded: '2024-10-01'
        }]]); // Simulate existing metrics

        const response = await request(app).get('/metrics/1');

        expect(response.status).toBe(200);
        expect(response.body).toEqual(expect.arrayContaining([expect.objectContaining({
            child_id: 1,
            height: 120,
            weight: 30,
            bmi: '20.83'
        })]));
    });

    test('should return 404 if no metrics found for the child ID', async () => {
        db.query.mockResolvedValueOnce([[]]); // Simulate no metrics found
        const response = await request(app).get('/metrics/1');

        expect(response.status).toBe(404);
        expect(response.body.message).toBe('No metrics found for this child');
    });

    test('should return 500 on error fetching metrics', async () => {
        db.query.mockRejectedValueOnce(new Error('Database error')); // Simulate error
        const response = await request(app).get('/metrics/1');

        expect(response.status).toBe(500);
        expect(response.body.message).toBe('Server error');
    });
});