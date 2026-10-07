import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import DashboardComponent from '../components/DashboardComponent';
import { UserContext } from '../context/UserContext';

const mockChildren = [
    { id: 1, child_name: 'John', dob: '2012-05-05', weight: 30, height: 130 },
    { id: 2, child_name: 'Jane', dob: '2010-08-10', weight: 45, height: 140 }
];

describe('DashboardComponent Tests', () => {
    const mockUser = { id: 1 };

    beforeEach(() => {
        // Mock localStorage to include a fake token
        jest.spyOn(Storage.prototype, 'getItem').mockImplementation((key) => {
            if (key === 'token') {
                return 'fake-token'; // return a fake token for the test
            }
            return null;
        });

        // Mock the fetch function to return the children data
        global.fetch = jest.fn(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve(mockChildren),
            })
        );
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    test('renders the DashboardComponent correctly', async () => {
        render(
            <MemoryRouter>
                <UserContext.Provider value={{ user: mockUser }}>
                    <DashboardComponent />
                </UserContext.Provider>
            </MemoryRouter>
        );

        // Check for the presence of the dashboard elements
        expect(screen.getByText('Welcome to NutriKids')).toBeInTheDocument();
        expect(screen.getByText('Your personalized hub for healthy living and meal planning.')).toBeInTheDocument();

        // Wait for John and Jane to be rendered using findByText
        expect(await screen.findByText('John')).toBeInTheDocument();
        expect(await screen.findByText('Jane')).toBeInTheDocument();
    });

    test('displays child information when a card is clicked', async () => {
        render(
            <MemoryRouter>
                <UserContext.Provider value={{ user: mockUser }}>
                    <DashboardComponent />
                </UserContext.Provider>
            </MemoryRouter>
        );

        // Find and click John's card
        const johnCard = await screen.findByText('John');
        fireEvent.click(johnCard);

        // Assert the displayed information for John
        expect(await screen.findByText('Age: 12')).toBeInTheDocument(); // Calculated age
        expect(screen.getByText('Weight: 30 kg')).toBeInTheDocument(); // Weight
        expect(screen.getByText('Height: 130 cm')).toBeInTheDocument(); // Height
        expect(screen.getByText(/BMI: 17.75/)).toBeInTheDocument(); // Match BMI value dynamically
    });

    test('calculates BMI correctly', async () => {
        render(
            <MemoryRouter>
                <UserContext.Provider value={{ user: mockUser }}>
                    <DashboardComponent />
                </UserContext.Provider>
            </MemoryRouter>
        );

        // Find and click John's card
        const johnCard = await screen.findByText('John');
        fireEvent.click(johnCard);

        // Check if BMI is calculated correctly
        expect(await screen.findByText(/BMI: 17.75/)).toBeInTheDocument();
        // Since BMI 17.75 falls under "Underweight"
        expect(screen.getByText(/Underweight/)).toBeInTheDocument();
    });

    test('generates recommendations based on BMI and age', async () => {
        render(
            <MemoryRouter>
                <UserContext.Provider value={{ user: mockUser }}>
                    <DashboardComponent />
                </UserContext.Provider>
            </MemoryRouter>
        );

        // Find and click Jane's card
        const janeCard = await screen.findByText('Jane');
        fireEvent.click(janeCard);

        // Check if recommendations are generated correctly for Jane
        expect(await screen.findByText(/Maintain a balanced diet with a variety of food groups./i)).toBeInTheDocument();
        expect(screen.getByText(/Monitor and maintain vitamin D levels for healthy adolescent development./i)).toBeInTheDocument();
    });
});