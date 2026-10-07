// src/components/MetricsFormComponent.test.js

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import MetricsFormComponent from './MetricsFormComponent';
import { UserContext } from '../context/UserContext';

// Mocking the fetch API
global.fetch = jest.fn();

const mockUser = {
    token: 'mock-token'
};

const mockChildrenData = [
    { id: 1, child_name: 'John' },
    { id: 2, child_name: 'Jane' }
];

describe('MetricsFormComponent', () => {
    beforeEach(() => {
        fetch.mockClear();
        console.error = jest.fn(); // Mock console.error to track error messages
        localStorage.setItem('token', mockUser.token); // Set the token for tests
    });

    test('renders MetricsFormComponent correctly', () => {
        render(
            <UserContext.Provider value={{ user: mockUser }}>
                <MetricsFormComponent onSave={jest.fn()} />
            </UserContext.Provider>
        );

        expect(screen.getByText('Manage Child Metrics')).toBeInTheDocument();
        expect(screen.getByLabelText('Select Child:')).toBeInTheDocument();
    });

    test('fetches and displays children in the dropdown', async () => {
        fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => mockChildrenData
        });

        render(
            <UserContext.Provider value={{ user: mockUser }}>
                <MetricsFormComponent onSave={jest.fn()} />
            </UserContext.Provider>
        );

        await waitFor(() => {
            expect(fetch).toHaveBeenCalledWith('http://localhost:5001/api/child/get-children', {
                headers: { 'Authorization': `Bearer ${mockUser.token}` },
            });
        });

        expect(await screen.findByText('John')).toBeInTheDocument();
        expect(await screen.findByText('Jane')).toBeInTheDocument();
    });

    test('handles input changes correctly', async () => {
        fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => mockChildrenData
        });

        render(
            <UserContext.Provider value={{ user: mockUser }}>
                <MetricsFormComponent onSave={jest.fn()} />
            </UserContext.Provider>
        );

        await waitFor(() => {
            expect(fetch).toHaveBeenCalledTimes(1);
        });

        fireEvent.change(screen.getByLabelText('Select Child:'), { target: { value: '1' } });
        fireEvent.change(screen.getByPlaceholderText('Height in cm'), { target: { value: '120' } });
        fireEvent.change(screen.getByPlaceholderText('Weight in kg'), { target: { value: '30' } });

        expect(screen.getByLabelText('Select Child:').value).toBe('1');
        expect(screen.getByPlaceholderText('Height in cm').value).toBe('120');
        expect(screen.getByPlaceholderText('Weight in kg').value).toBe('30');
    });

    test('calls onSave with correct values on form submission', async () => {
        const mockOnSave = jest.fn();

        fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => mockChildrenData
        });

        render(
            <UserContext.Provider value={{ user: mockUser }}>
                <MetricsFormComponent onSave={mockOnSave} />
            </UserContext.Provider>
        );

        await waitFor(() => {
            expect(fetch).toHaveBeenCalledTimes(1);
        });

        fireEvent.change(screen.getByLabelText('Select Child:'), { target: { value: '1' } });
        fireEvent.change(screen.getByPlaceholderText('Height in cm'), { target: { value: '120' } });
        fireEvent.change(screen.getByPlaceholderText('Weight in kg'), { target: { value: '30' } });
        fireEvent.click(screen.getByRole('button', { name: /save metrics/i }));

        expect(mockOnSave).toHaveBeenCalledWith('1', {
            dateRecorded: expect.any(String), // Adjust as necessary based on your implementation
            height: '120',
            weight: '30',
        });
    });

    test('handles errors when fetching children', async () => {
        fetch.mockResolvedValueOnce({
            ok: false,
            status: 500
        });

        render(
            <UserContext.Provider value={{ user: mockUser }}>
                <MetricsFormComponent onSave={jest.fn()} />
            </UserContext.Provider>
        );

        await waitFor(() => {
            expect(console.error).toHaveBeenCalledWith('Failed to fetch children:', 500);
        });

        expect(screen.queryByLabelText('Select Child:')).not.toBeInTheDocument();
    });

    test('shows error when no token is found', async () => {
        localStorage.removeItem('token'); // Simulate absence of token

        render(
            <UserContext.Provider value={{ user: { token: null } }}>
                <MetricsFormComponent onSave={jest.fn()} />
            </UserContext.Provider>
        );

        await waitFor(() => {
            expect(console.error).toHaveBeenCalledWith('No token found');
        });
    });
});