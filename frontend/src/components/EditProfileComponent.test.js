import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import EditProfileComponent from '../components/EditProfileComponent';
import { UserContext } from '../context/UserContext';

// Mock the window.alert function
global.alert = jest.fn();

describe('EditProfileComponent', () => {
    const mockUser = { email: 'testuser@example.com' };
    const mockFetch = jest.spyOn(global, 'fetch');

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('renders EditProfileComponent correctly', () => {
        render(
            <UserContext.Provider value={{ user: mockUser }}>
                <EditProfileComponent />
            </UserContext.Provider>
        );

        expect(screen.getByText(/Edit Profile/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/What would you like to update?/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /update/i })).toBeInTheDocument();
    });

    test('allows user to select email update option and enter a new email', () => {
        render(
            <UserContext.Provider value={{ user: mockUser }}>
                <EditProfileComponent />
            </UserContext.Provider>
        );

        fireEvent.change(screen.getByLabelText(/What would you like to update?/i), {
            target: { value: 'email' },
        });

        fireEvent.change(screen.getByLabelText(/New Email/i), {
            target: { value: 'newemail@example.com' },
        });

        expect(screen.getByDisplayValue('newemail@example.com')).toBeInTheDocument();
    });

    test('allows user to select password update option and enter a new password', () => {
        render(
            <UserContext.Provider value={{ user: mockUser }}>
                <EditProfileComponent />
            </UserContext.Provider>
        );

        fireEvent.change(screen.getByLabelText(/What would you like to update?/i), {
            target: { value: 'password' },
        });

        fireEvent.change(screen.getByLabelText(/New Password/i), {
            target: { value: 'Test1234!' },
        });
        fireEvent.change(screen.getByLabelText(/Confirm Password/i), {
            target: { value: 'Test1234!' },
        });

        const passwordInputs = screen.queryAllByDisplayValue('Test1234!');
        expect(passwordInputs.length).toBe(2);
    });

    test('validates password confirmation matches', async () => {
        render(
            <UserContext.Provider value={{ user: mockUser }}>
                <EditProfileComponent />
            </UserContext.Provider>
        );

        fireEvent.change(screen.getByLabelText(/What would you like to update?/i), {
            target: { value: 'password' },
        });

        fireEvent.change(screen.getByLabelText(/New Password/i), {
            target: { value: 'Test1234!' },
        });
        fireEvent.change(screen.getByLabelText(/Confirm Password/i), {
            target: { value: 'Test5678!' },
        });

        fireEvent.click(screen.getByRole('button', { name: /update/i }));

        await waitFor(() => {
            expect(screen.getByText('Passwords do not match')).toBeInTheDocument();
        });
    });

    test('requires confirmation checkbox before submission', async () => {
        render(
            <UserContext.Provider value={{ user: mockUser }}>
                <EditProfileComponent />
            </UserContext.Provider>
        );

        fireEvent.change(screen.getByLabelText(/What would you like to update?/i), {
            target: { value: 'email' },
        });

        fireEvent.change(screen.getByLabelText(/New Email/i), {
            target: { value: 'newemail@example.com' },
        });

        fireEvent.click(screen.getByRole('button', { name: /update/i }));

        await waitFor(() => {
            expect(screen.getByText('Please confirm that you want to make this change.')).toBeInTheDocument();
        });
    });

    test('submits email update when confirmed', async () => {
        mockFetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ({ message: 'Profile updated successfully!' }),
        });

        render(
            <UserContext.Provider value={{ user: mockUser }}>
                <EditProfileComponent />
            </UserContext.Provider>
        );

        fireEvent.change(screen.getByLabelText(/What would you like to update?/i), {
            target: { value: 'email' },
        });

        fireEvent.change(screen.getByLabelText(/New Email/i), {
            target: { value: 'newemail@example.com' },
        });

        fireEvent.click(screen.getByLabelText(/I confirm that I want to make this change/i));
        fireEvent.click(screen.getByRole('button', { name: /update/i }));

        expect(await screen.findByText('Profile updated successfully!')).toBeInTheDocument();
        expect(mockFetch).toHaveBeenCalledTimes(1);
        expect(mockFetch).toHaveBeenCalledWith(
            'http://localhost:5001/api/auth/update-profile',
            expect.objectContaining({
                method: 'PUT',
                body: JSON.stringify({ email: 'newemail@example.com' }),
            })
        );
    });

    test('submits password update when confirmed', async () => {
        mockFetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ({ message: 'Profile updated successfully!' }),
        });

        render(
            <UserContext.Provider value={{ user: mockUser }}>
                <EditProfileComponent />
            </UserContext.Provider>
        );

        fireEvent.change(screen.getByLabelText(/What would you like to update?/i), {
            target: { value: 'password' },
        });

        fireEvent.change(screen.getByLabelText(/New Password/i), {
            target: { value: 'Test1234!' },
        });
        fireEvent.change(screen.getByLabelText(/Confirm Password/i), {
            target: { value: 'Test1234!' },
        });

        fireEvent.click(screen.getByLabelText(/I confirm that I want to make this change/i));
        fireEvent.click(screen.getByRole('button', { name: /update/i }));

        expect(await screen.findByText('Profile updated successfully!')).toBeInTheDocument();
        expect(mockFetch).toHaveBeenCalledTimes(1);
        expect(mockFetch).toHaveBeenCalledWith(
            'http://localhost:5001/api/auth/update-profile',
            expect.objectContaining({
                method: 'PUT',
                body: JSON.stringify({ password: 'Test1234!' }),
            })
        );
    });
});