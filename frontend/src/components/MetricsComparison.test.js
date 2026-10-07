import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import MetricsComparison from './MetricsComparison';
import { UserContext } from '../context/UserContext';

const mockUser = { token: 'mock-token' };

describe('MetricsComparison', () => {
    const renderComponent = () => {
        render(
            <UserContext.Provider value={{ user: mockUser }}>
                <MetricsComparison />
            </UserContext.Provider>
        );
    };

    beforeEach(() => {
        jest.clearAllMocks();
        localStorage.setItem('token', 'mock-token');
    });

    test('renders MetricsComparison correctly', () => {
        renderComponent();
        expect(screen.getByText(/metrics comparison/i)).toBeInTheDocument();
        expect(screen.getByRole('combobox')).toHaveValue('');
    });

    test('fetches and displays children in the dropdown', async () => {
        const mockChildren = [
            { id: 1, child_name: 'Child 1', height: 120, weight: 30 },
            { id: 2, child_name: 'Child 2', height: 110, weight: 25 }
        ];

        global.fetch = jest.fn(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve(mockChildren)
            })
        );

        renderComponent();

        await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1));
        expect(screen.getByRole('combobox')).toHaveValue('');

        fireEvent.change(screen.getByRole('combobox'), { target: { value: '1' } });
        expect(screen.getByRole('combobox')).toHaveValue('1');
        expect(screen.getByText(/original metrics for child 1/i)).toBeInTheDocument();
    });

    test('fetches updated metrics when a child is selected', async () => {
        const mockChildren = [
            { id: 1, child_name: 'Child 1', height: 120, weight: 30 },
        ];
        const mockMetrics = [
            { date_recorded: '2024-10-01', height: 122, weight: 32, bmi: 18.80 },
            { date_recorded: '2024-10-15', height: 124, weight: 34, bmi: 19.50 },
        ];

        global.fetch = jest.fn((url) => {
            if (url.includes('get-children')) {
                return Promise.resolve({
                    ok: true,
                    json: () => Promise.resolve(mockChildren)
                });
            } else if (url.includes('metrics')) {
                return Promise.resolve({
                    ok: true,
                    json: () => Promise.resolve(mockMetrics)
                });
            }
        });

        renderComponent();

        await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1));
        fireEvent.change(screen.getByRole('combobox'), { target: { value: '1' } });

        await waitFor(() => expect(fetch).toHaveBeenCalledTimes(2));
        expect(screen.getByText(/updated metrics/i)).toBeInTheDocument();
        expect(screen.getByText(/date recorded: 2024-10-01/i)).toBeInTheDocument();
        expect(screen.getByText(/height: 122 cm/i)).toBeInTheDocument();
        expect(screen.getByText(/weight: 32 kg/i)).toBeInTheDocument();
        expect(screen.getByText(/bmi: 18.80/i)).toBeInTheDocument();
    });

    test('handles error when fetching children', async () => {
        global.fetch = jest.fn(() =>
            Promise.resolve({
                ok: false,
                status: 500
            })
        );

        console.error = jest.fn(); // Mock console.error

        renderComponent();

        await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1));
        await waitFor(() => expect(console.error).toHaveBeenCalledWith('Failed to fetch children:', 500));
    });
});