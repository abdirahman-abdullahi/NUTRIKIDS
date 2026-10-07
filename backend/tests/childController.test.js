const request = require('supertest');
const express = require('express');
const childController = require('../controllers/childController');
const db = require('../config/db'); // Import your database config

const app = express();
app.use(express.json());
app.post('/children', childController.addChild);
app.get('/children', childController.getChildren); // Assume middleware to authenticate user is applied

// Mock database
jest.mock('../config/db');

describe('Child Controller', () => {
    afterEach(() => {
        jest.clearAllMocks(); // Clear mock calls after each test
    });

    describe('addChild', () => {
        test('should add a child successfully', async () => {
            const req = {
                body: {
                    childName: 'Test Child',
                    dob: '2015-01-01',
                    weight: 30,
                    height: 120
                },
                user: { userId: 1 } // Simulated authenticated user ID
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };

            db.query.mockResolvedValueOnce([{}]); // Mock successful DB insertion
            await childController.addChild(req, res);

            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith({ message: 'Child registered successfully' });
        });

        test('should return 400 if parent ID is missing', async () => {
            const req = {
                body: {
                    childName: 'Test Child',
                    dob: '2015-01-01',
                    weight: 30,
                    height: 120
                },
                user: {} // Simulated request without user
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };

            await childController.addChild(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ message: 'Parent ID is missing' });
        });

        test('should return 500 on error during child registration', async () => {
            const req = {
                body: {
                    childName: 'Test Child',
                    dob: '2015-01-01',
                    weight: 30,
                    height: 120
                },
                user: { userId: 1 } // Simulated authenticated user ID
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };

            db.query.mockRejectedValueOnce(new Error('Database error')); // Simulate error
            await childController.addChild(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ message: 'Server error' });
        });
    });

    describe('getChildren', () => {
        test('should return children for the authenticated user', async () => {
            const req = {
                user: { id: 1 } // Simulated authenticated user ID
            };
            const res = {
                json: jest.fn()
            };

            const mockChildren = [{ id: 1, child_name: 'Test Child', dob: '2015-01-01', weight: 30, height: 120 }];
            db.query.mockResolvedValueOnce([mockChildren]); // Mock successful DB fetch
            await childController.getChildren(req, res);

            expect(res.json).toHaveBeenCalledWith(mockChildren);
        });

        test('should return 404 if no children found', async () => {
            const req = {
                user: { id: 1 } // Simulated authenticated user ID
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };

            db.query.mockResolvedValueOnce([[]]); // Simulate no children found
            await childController.getChildren(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ message: 'No children found' });
        });

        test('should return 500 on error fetching children', async () => {
            const req = {
                user: { id: 1 } // Simulated authenticated user ID
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };

            db.query.mockRejectedValueOnce(new Error('Database error')); // Simulate error
            await childController.getChildren(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ message: 'Server error', error: 'Database error' });
        });
    });
});