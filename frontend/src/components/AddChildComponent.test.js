import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import AddChildComponent from '../components/AddChildComponent';
import { UserContext } from '../context/UserContext';

describe('AddChildComponent Tests', () => {
    const mockUser = { id: 1 };
    const token = 'mock-token';

    beforeEach(() => {
        localStorage.setItem('token', token);
    });

    afterEach(() => {
        localStorage.clear();
    });

    test('renders the AddChildComponent correctly', () => {
        render(
            <MemoryRouter>
                <UserContext.Provider value={{ user: mockUser }}>
                    <AddChildComponent />
                </UserContext.Provider>
            </MemoryRouter>
        );

        // Check if the form fields and button are rendered
        expect(screen.getByLabelText(/Child's Name/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Date of Birth/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Weight/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Height/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Add Child/i })).toBeInTheDocument();
    });

    test('displays alert if child age is less than 5', async () => {
        window.alert = jest.fn();

        render(
            <MemoryRouter>
                <UserContext.Provider value={{ user: mockUser }}>
                    <AddChildComponent />
                </UserContext.Provider>
            </MemoryRouter>
        );

        // Simulate entering a date of birth where age is less than 5 years
        fireEvent.change(screen.getByLabelText(/Date of Birth/i), { target: { value: '2020-01-01' } });
        fireEvent.change(screen.getByLabelText(/Weight/i), { target: { value: '15' } });
        fireEvent.change(screen.getByLabelText(/Height/i), { target: { value: '80' } });

        fireEvent.click(screen.getByRole('button', { name: /Add Child/i }));

        await waitFor(() => {
            expect(window.alert).toHaveBeenCalledWith('Only children between the ages of 5 and 18 years are eligible.');
        });
    });

    test('displays alert if weight or height is too low', async () => {
        window.alert = jest.fn();

        render(
            <MemoryRouter>
                <UserContext.Provider value={{ user: mockUser }}>
                    <AddChildComponent />
                </UserContext.Provider>
            </MemoryRouter>
        );

        // Simulate entering low weight and height
        fireEvent.change(screen.getByLabelText(/Date of Birth/i), { target: { value: '2010-01-01' } });
        fireEvent.change(screen.getByLabelText(/Weight/i), { target: { value: '5' } });
        fireEvent.change(screen.getByLabelText(/Height/i), { target: { value: '60' } });

        fireEvent.click(screen.getByRole('button', { name: /Add Child/i }));

        await waitFor(() => {
            expect(window.alert).toHaveBeenCalledWith('Please check the weight and height, they seem too low.');
        });
    });

    test('displays alert if Parent ID is missing', async () => {
        window.alert = jest.fn();

        render(
            <MemoryRouter>
                <UserContext.Provider value={{ user: null }}>
                    <AddChildComponent />
                </UserContext.Provider>
            </MemoryRouter>
        );

        fireEvent.change(screen.getByLabelText(/Date of Birth/i), { target: { value: '2010-01-01' } });
        fireEvent.change(screen.getByLabelText(/Weight/i), { target: { value: '20' } });
        fireEvent.change(screen.getByLabelText(/Height/i), { target: { value: '100' } });

        fireEvent.click(screen.getByRole('button', { name: /Add Child/i }));

        await waitFor(() => {
            expect(window.alert).toHaveBeenCalledWith('Parent ID is missing, please log in again.');
        });
    });

    test('handles successful child registration', async () => {
        global.fetch = jest.fn(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve({ message: 'Child registered successfully!' }),
            })
        );

        window.alert = jest.fn();

        render(
            <MemoryRouter>
                <UserContext.Provider value={{ user: mockUser }}>
                    <AddChildComponent />
                </UserContext.Provider>
            </MemoryRouter>
        );

        fireEvent.change(screen.getByLabelText(/Child's Name/i), { target: { value: 'John' } });
        fireEvent.change(screen.getByLabelText(/Date of Birth/i), { target: { value: '2010-01-01' } });
        fireEvent.change(screen.getByLabelText(/Weight/i), { target: { value: '30' } });
        fireEvent.change(screen.getByLabelText(/Height/i), { target: { value: '120' } });

        fireEvent.click(screen.getByRole('button', { name: /Add Child/i }));

        await waitFor(() => {
            expect(window.alert).toHaveBeenCalledWith('Child registered successfully!');
        });
    });

    test('handles registration failure due to API error', async () => {
        global.fetch = jest.fn(() =>
            Promise.resolve({
                ok: false,
                json: () => Promise.resolve({ message: 'Registration failed' }),
            })
        );

        window.alert = jest.fn();

        render(
            <MemoryRouter>
                <UserContext.Provider value={{ user: mockUser }}>
                    <AddChildComponent />
                </UserContext.Provider>
            </MemoryRouter>
        );

        fireEvent.change(screen.getByLabelText(/Child's Name/i), { target: { value: 'John' } });
        fireEvent.change(screen.getByLabelText(/Date of Birth/i), { target: { value: '2010-01-01' } });
        fireEvent.change(screen.getByLabelText(/Weight/i), { target: { value: '30' } });
        fireEvent.change(screen.getByLabelText(/Height/i), { target: { value: '120' } });

        fireEvent.click(screen.getByRole('button', { name: /Add Child/i }));

        await waitFor(() => {
            expect(window.alert).toHaveBeenCalledWith('Registration failed');
        });
    });
});