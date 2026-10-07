import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom'; // Required for components using Link
import HomeComponent from '../components/HomeComponent';

describe('HomeComponent Tests', () => {
    test('renders the HomeComponent correctly', () => {
        render(
            <MemoryRouter>
                <HomeComponent />
            </MemoryRouter>
        );

        // Check if the header and paragraph text are present
        expect(screen.getByText(/Healthy Meals, Delivered to Your Kids/i)).toBeInTheDocument();
        expect(screen.getByText(/Convenient, nutritious meals tailored to your child's dietary needs/i)).toBeInTheDocument();

        // Check if Sign In and Sign Up links are rendered
        expect(screen.getByText(/Sign In/i)).toBeInTheDocument();
        expect(screen.getByText(/Sign Up/i)).toBeInTheDocument();
    });
});