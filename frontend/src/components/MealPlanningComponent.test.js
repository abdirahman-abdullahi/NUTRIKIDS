import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import MealPlanningComponent from './MealPlanningComponent';
import { UserContext } from '../context/UserContext';

const mockUser = { token: 'mock-token' };

describe('MealPlanningComponent', () => {
    const renderComponent = () => {
        render(
            <UserContext.Provider value={{ user: mockUser }}>
                <MealPlanningComponent />
            </UserContext.Provider>
        );
    };

    beforeEach(() => {
        jest.clearAllMocks();
        localStorage.setItem('token', 'mock-token');
    });

    test('renders MealPlanningComponent correctly', () => {
        renderComponent();
        expect(screen.getByLabelText(/child/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/breakfast item/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/lunch item/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/dinner item/i)).toBeInTheDocument();
        expect(screen.getByText(/submit meal plan/i)).toBeInTheDocument();
    });

    test('fetches and displays children in the dropdown', async () => {
        const mockChildren = [
            { id: 1, child_name: 'Child 1' },
            { id: 2, child_name: 'Child 2' }
        ];
        global.fetch = jest.fn(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve(mockChildren)
            })
        );

        renderComponent();

        await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1));

        expect(screen.getByLabelText(/child/i)).toHaveValue('');
        fireEvent.change(screen.getByLabelText(/child/i), { target: { value: '1' } });
        expect(screen.getByLabelText(/child/i)).toHaveValue('1');
    });

    test('submits the meal plan correctly', async () => {
        const mockChildren = [
            { id: 1, child_name: 'Child 1' }
        ];
        const mockFoods = [
            { food_id: '1', name: 'Pancakes', category: 'Breakfast' },
            { food_id: '2', name: 'Juice', category: 'Drinks' },
            { food_id: '3', name: 'Sandwich', category: 'Lunch' },
            { food_id: '4', name: 'Water', category: 'Drinks' },
            { food_id: '5', name: 'Pasta', category: 'Dinner' },
            { food_id: '6', name: 'Soda', category: 'Drinks' },
        ];

        global.fetch = jest.fn((url) => {
            if (url.includes('get-children')) {
                return Promise.resolve({
                    ok: true,
                    json: () => Promise.resolve(mockChildren)
                });
            } else if (url.includes('foods')) {
                return Promise.resolve({
                    ok: true,
                    json: () => Promise.resolve(mockFoods)
                });
            } else if (url.includes('mealplans')) {
                return Promise.resolve({
                    ok: true,
                    json: () => Promise.resolve({ success: true })
                });
            }
        });

        renderComponent();

        await waitFor(() => expect(fetch).toHaveBeenCalledTimes(2));

        fireEvent.change(screen.getByLabelText(/child/i), { target: { value: '1' } });
        fireEvent.change(screen.getByLabelText(/breakfast item/i), { target: { value: '1' } });
        fireEvent.change(screen.getByLabelText(/breakfast drink/i), { target: { value: '2' } });
        fireEvent.change(screen.getByLabelText(/lunch item/i), { target: { value: '3' } });
        fireEvent.change(screen.getByLabelText(/lunch drink/i), { target: { value: '4' } });
        fireEvent.change(screen.getByLabelText(/dinner item/i), { target: { value: '5' } });
        fireEvent.change(screen.getByLabelText(/dinner drink/i), { target: { value: '6' } });

        fireEvent.click(screen.getByText(/submit meal plan/i));

        await waitFor(() => expect(fetch).toHaveBeenCalledTimes(3));
        expect(global.fetch).toHaveBeenCalledWith(
            'http://localhost:5001/api/mealplans',
            expect.objectContaining({
                method: 'POST'
            })
        );
    });

    test('handles error when fetching children', async () => {
        global.fetch = jest.fn(() =>
            Promise.resolve({
                ok: false,
                status: 500
            })
        );

        renderComponent();

        await waitFor(() => expect(console.error).toHaveBeenCalledWith('Failed to fetch children:', 500));
    });

    test('handles error when submitting meal plan', async () => {
        const mockChildren = [
            { id: 1, child_name: 'Child 1' }
        ];
        const mockFoods = [
            { food_id: '1', name: 'Pancakes', category: 'Breakfast' },
        ];

        global.fetch = jest.fn((url) => {
            if (url.includes('get-children')) {
                return Promise.resolve({
                    ok: true,
                    json: () => Promise.resolve(mockChildren)
                });
            } else if (url.includes('foods')) {
                return Promise.resolve({
                    ok: true,
                    json: () => Promise.resolve(mockFoods)
                });
            } else if (url.includes('mealplans')) {
                return Promise.resolve({
                    ok: false,
                    status: 500
                });
            }
        });

        renderComponent();

        await waitFor(() => expect(fetch).toHaveBeenCalledTimes(2));

        fireEvent.change(screen.getByLabelText(/child/i), { target: { value: '1' } });
        fireEvent.change(screen.getByLabelText(/breakfast item/i), { target: { value: '1' } });

        fireEvent.click(screen.getByText(/submit meal plan/i));

        await waitFor(() => expect(console.error).toHaveBeenCalledWith('Error submitting meal plan:', expect.any(Error)));
    });
});