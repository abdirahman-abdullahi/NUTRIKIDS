// backend/__tests__/authController.test.js
const request = require('supertest');
const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('../config/db'); // Import your database config
const authController = require('../controllers/authController');

const app = express();
app.use(express.json());
app.post('/register', authController.register);
app.post('/login', authController.login);
app.put('/updateProfile', authController.updateProfile); // Assume middleware to authenticate user is applied

// Mock database
jest.mock('../config/db');

describe('Auth Controller', () => {
    afterEach(() => {
        jest.clearAllMocks(); // Clear mock calls after each test
    });

    test('should register a user', async () => {
        db.query.mockResolvedValueOnce([[]]); // No existing users
        const response = await request(app).post('/register').send({
            name: 'Test User',
            email: 'test@example.com',
            password: 'password123'
        });

        expect(response.status).toBe(201);
        expect(response.body.message).toBe('User registered successfully. You can now log in.');
        expect(db.query).toHaveBeenCalledTimes(2); // Check that db.query was called twice
    });

    test('should return 400 if email is already in use', async () => {
        db.query.mockResolvedValueOnce([[{ email: 'test@example.com' }]]); // Simulate existing user
        const response = await request(app).post('/register').send({
            name: 'Test User',
            email: 'test@example.com',
            password: 'password123'
        });

        expect(response.status).toBe(400);
        expect(response.body.message).toBe('Email already in use');
    });

    test('should login a user', async () => {
        const hashedPassword = await bcrypt.hash('password123', 10);
        db.query.mockResolvedValueOnce([[{ id: 1, email: 'test@example.com', password: hashedPassword }]]); // Simulate existing user
        const response = await request(app).post('/login').send({
            email: 'test@example.com',
            password: 'password123'
        });

        expect(response.status).toBe(200);
        expect(response.body.token).toBeDefined();
    });

    test('should return 400 for invalid credentials', async () => {
        db.query.mockResolvedValueOnce([[{ id: 1, email: 'test@example.com', password: 'wrongpassword' }]]); // Simulate existing user with wrong password
        const response = await request(app).post('/login').send({
            email: 'test@example.com',
            password: 'password123'
        });

        expect(response.status).toBe(400);
        expect(response.body.message).toBe('Invalid credentials');
    });

    test('should update user profile', async () => {
        // Mock authentication middleware to attach user to request
        const req = {
            body: {
                email: 'newemail@example.com',
                password: 'newpassword123'
            },
            user: { userId: 1 } // Simulated authenticated user ID
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        db.query.mockResolvedValueOnce([{}]); // Mock successful DB update
        await authController.updateProfile(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ message: 'Profile updated successfully.' });
    });

    test('should return 500 on profile update error', async () => {
        const req = {
            body: {
                email: 'newemail@example.com'
            },
            user: { userId: 1 }
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        db.query.mockRejectedValueOnce(new Error('Database error')); // Simulate error
        await authController.updateProfile(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ message: 'Server error' });
    });
});