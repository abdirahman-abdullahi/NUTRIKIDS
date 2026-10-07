import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import ViewMealPlansComponent from './ViewMealPlansComponent';
import { UserContext } from '../context/UserContext';
import { MemoryRouter } from 'react-router-dom';

beforeEach(() => {
    localStorage.setItem('token', 'mockToken'); // Set the token
    global.fetch = jest.fn(() =>
        Promise.resolve({
            json: () => Promise.resolve([{ id: 1, name: 'Child 1' }, { id: 2, name: 'Child 2' }]),
        })
    );
});

const mockUser = { token: 'mock-token' };

const renderComponent = () => {
    render(
        <MemoryRouter>
            <UserContext.Provider value={{ user: mockUser }}>
                <ViewMealPlansComponent />
            </UserContext.Provider>
        </MemoryRouter>
    );
};

describe('ViewMealPlansComponent', () => {
    beforeAll(() => {
        // Mock the fetch function globally before tests
        global.fetch = jest.fn();
    });

    afterAll(() => {
        // Restore original fetch after all tests
        global.fetch.mockRestore();
    });

    test('renders ViewMealPlansComponent correctly', () => {
        renderComponent();
        expect(screen.getByText('View Meal Plans')).toBeInTheDocument();
        expect(screen.getByLabelText('Select Child:')).toBeInTheDocument();
    });

    test('fetches and displays children in the dropdown', async () => {
        // Mock the fetch response for children
        fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => [
                { id: 1, child_name: 'John' },
                { id: 2, child_name: 'Jane' }
            ],
        });

        renderComponent();

        // Wait for the children to be fetched
        await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1));

        expect(screen.getByLabelText('Select Child:')).toBeInTheDocument();
        expect(screen.getByText('Select a child')).toBeInTheDocument();
        expect(screen.getByText('John')).toBeInTheDocument();
        expect(screen.getByText('Jane')).toBeInTheDocument();
    });

    test('fetches and displays meal plans when a child is selected', async () => {
        // Mock the fetch response for children
        fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => [
                { id: 1, child_name: 'John' },
                { id: 2, child_name: 'Jane' }
            ],
        });

        // Mock the fetch response for meal plans
        fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => [
                {
                    plan_id: 1,
                    breakfast_item_name: 'Pancakes',
                    breakfast_drink_name: 'Milk',
                    lunch_item_name: 'Sandwich',
                    lunch_drink_name: 'Juice',
                    dinner_item_name: 'Pasta',
                    dinner_drink_name: 'Water',
                    date_created: '2024-10-01',
                },
            ],
        });

        renderComponent();

        await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1));

        // Select a child
        fireEvent.change(screen.getByLabelText('Select Child:'), { target: { value: '1' } });

        // Wait for the meal plans to be fetched based on the selected child
        await waitFor(() => expect(fetch).toHaveBeenCalledWith('http://localhost:5001/api/mealplans/1', {
            headers: { 'Authorization': `Bearer ${mockUser.token}` },
        }));

        // Check if meal plans are displayed
        expect(screen.getByText('Meal Plans for John')).toBeInTheDocument();
        expect(screen.getByText('Breakfast Item: Pancakes')).toBeInTheDocument();
    });

    test('handles errors when fetching children', async () => {
        // Mock the fetch response to simulate an error
        fetch.mockResolvedValueOnce({
            ok: false,
            status: 500,
        });

        console.error = jest.fn(); // Mock console.error to track error logging
        renderComponent();

        await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1));

        await waitFor(() => {
            expect(console.error).toHaveBeenCalledWith('Failed to fetch children:', 500);
        });

        expect(screen.queryByLabelText('Select Child:')).not.toBeInTheDocument();
    });

    test('handles errors when fetching meal plans', async () => {
        // Mock the fetch response for children
        fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => [
                { id: 1, child_name: 'John' },
            ],
        });

        // Mock the fetch response to simulate an error for meal plans
        fetch.mockResolvedValueOnce({
            ok: false,
            status: 500,
        });

        renderComponent();

        await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1));

        // Select a child
        fireEvent.change(screen.getByLabelText('Select Child:'), { target: { value: '1' } });

        await waitFor(() => {
            expect(fetch).toHaveBeenCalledWith('http://localhost:5001/api/mealplans/1', {
                headers: { 'Authorization': `Bearer ${mockUser.token}` },
            });
        });

        await waitFor(() => {
            expect(console.error).toHaveBeenCalledWith('Failed to fetch meal plans:', 500);
        });

        expect(screen.queryByText('Meal Plans for John')).not.toBeInTheDocument();
    });
});