import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import LoginComponent from '../components/LoginComponent';
import { UserContext } from '../context/UserContext';

describe('LoginComponent Tests', () => {
    const setUser = jest.fn();

    test('renders the LoginComponent correctly', () => {
        render(
            <MemoryRouter>
                <UserContext.Provider value={{ setUser }}>
                    <LoginComponent />
                </UserContext.Provider>
            </MemoryRouter>
        );

        // Check if the form fields and button are rendered
        expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Login/i })).toBeInTheDocument();
    });

    test('toggles password visibility when the eye icon is clicked', () => {
        render(
            <MemoryRouter>
                <UserContext.Provider value={{ setUser }}>
                    <LoginComponent />
                </UserContext.Provider>
            </MemoryRouter>
        );

        const passwordInput = screen.getByLabelText(/Password/i);
        const togglePassword = screen.getByText('👁️'); // Icon for toggling visibility

        // Password field should be of type "password" initially
        expect(passwordInput.type).toBe('password');

        // Click to toggle visibility
        fireEvent.click(togglePassword);

        // Password field should now be of type "text"
        expect(passwordInput.type).toBe('text');

        // Click again to hide the password
        fireEvent.click(togglePassword);

        // Password field should be "password" again
        expect(passwordInput.type).toBe('password');
    });

    test('handles form submission with correct credentials', async () => {
        // Mock fetch call
        global.fetch = jest.fn(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve({ token: 'fake-jwt-token' }),
            })
        );

        render(
            <MemoryRouter>
                <UserContext.Provider value={{ setUser }}>
                    <LoginComponent />
                </UserContext.Provider>
            </MemoryRouter>
        );

        // Simulate user input
        fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'john@example.com' } });
        fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'Password123!' } });

        fireEvent.click(screen.getByRole('button', { name: /Login/i }));

        // Wait for the token to be stored and user context to be set
        await waitFor(() => {
            expect(setUser).toHaveBeenCalled();
        });
    });

    test('handles form submission with incorrect credentials', async () => {
        // Mock fetch call for invalid credentials
        global.fetch = jest.fn(() =>
            Promise.resolve({
                ok: false,
                status: 401,
                text: () => Promise.resolve('Invalid credentials'),
            })
        );

        // Mock the alert function
        jest.spyOn(window, 'alert').mockImplementation(() => {});

        render(
            <MemoryRouter>
                <UserContext.Provider value={{ setUser }}>
                    <LoginComponent />
                </UserContext.Provider>
            </MemoryRouter>
        );

        // Simulate user input
        fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'wrong@example.com' } });
        fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'WrongPassword123!' } });

        fireEvent.click(screen.getByRole('button', { name: /Login/i }));

        // Check if alert is called with the error message
        await waitFor(() => {
            expect(window.alert).toHaveBeenCalledWith('Login failed: 401 - Invalid credentials');
        });

        // Restore the original alert function after the test
        window.alert.mockRestore();
    });
});