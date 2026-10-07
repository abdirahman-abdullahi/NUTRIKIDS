// src/components/RegisterComponent.test.js

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import RegisterComponent from './RegisterComponent';

// Mocking the fetch API
global.fetch = jest.fn();

describe('RegisterComponent', () => {
    beforeEach(() => {
        fetch.mockClear();
        // Mocking window alert
        window.alert = jest.fn();
    });

    test('renders RegisterComponent correctly', () => {
        render(
            <Router>
                <RegisterComponent />
            </Router>
        );

        expect(screen.getByRole('heading', { name: /Register/i })).toBeInTheDocument();
        expect(screen.getByLabelText('Name')).toBeInTheDocument();
        expect(screen.getByLabelText('Email')).toBeInTheDocument();
        expect(screen.getByLabelText('Password')).toBeInTheDocument();
        expect(screen.getByLabelText('Confirm Password')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Register/i })).toBeInTheDocument();
    });

    test('handles input changes correctly', () => {
        render(
            <Router>
                <RegisterComponent />
            </Router>
        );

        fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'John Doe' } });
        fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'john@example.com' } });
        fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'Password@123' } });
        fireEvent.change(screen.getByLabelText('Confirm Password'), { target: { value: 'Password@123' } });

        expect(screen.getByLabelText('Name').value).toBe('John Doe');
        expect(screen.getByLabelText('Email').value).toBe('john@example.com');
        expect(screen.getByLabelText('Password').value).toBe('Password@123');
        expect(screen.getByLabelText('Confirm Password').value).toBe('Password@123');
    });

    test('shows alert if passwords do not match', async () => {
        render(
            <Router>
                <RegisterComponent />
            </Router>
        );

        fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'Password@123' } });
        fireEvent.change(screen.getByLabelText('Confirm Password'), { target: { value: 'Password123' } });

        fireEvent.click(screen.getByRole('button', { name: /Register/i }));

        await waitFor(() => {
            expect(window.alert).toHaveBeenCalledWith('Passwords do not match');
        });
    });

    test('calls fetch with correct arguments on successful registration', async () => {
        fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ({ message: 'Registration successful!' })
        });

        render(
            <Router>
                <RegisterComponent />
            </Router>
        );

        fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'John Doe' } });
        fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'john@example.com' } });
        fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'Password@123' } });
        fireEvent.change(screen.getByLabelText('Confirm Password'), { target: { value: 'Password@123' } });

        fireEvent.click(screen.getByRole('button', { name: /Register/i }));

        await waitFor(() => {
            expect(fetch).toHaveBeenCalledWith('http://localhost:5001/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: 'John Doe',
                    email: 'john@example.com',
                    password: 'Password@123'
                }),
            });
        });
    });

    test('shows alert on registration failure', async () => {
        fetch.mockResolvedValueOnce({
            ok: false,
            json: async () => ({ message: 'Registration failed' })
        });

        render(
            <Router>
                <RegisterComponent />
            </Router>
        );

        fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'John Doe' } });
        fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'john@example.com' } });
        fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'Password@123' } });
        fireEvent.change(screen.getByLabelText('Confirm Password'), { target: { value: 'Password@123' } });

        fireEvent.click(screen.getByRole('button', { name: /Register/i }));

        await waitFor(() => {
            expect(window.alert).toHaveBeenCalledWith('Registration failed: Registration failed');
        });
    });

    test('handles network errors during registration', async () => {
        fetch.mockRejectedValueOnce(new Error('Network Error'));

        render(
            <Router>
                <RegisterComponent />
            </Router>
        );

        fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'John Doe' } });
        fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'john@example.com' } });
        fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'Password@123' } });
        fireEvent.change(screen.getByLabelText('Confirm Password'), { target: { value: 'Password@123' } });

        fireEvent.click(screen.getByRole('button', { name: /Register/i }));

        await waitFor(() => {
            expect(window.alert).toHaveBeenCalledWith('Error during registration.');
        });
    });
});