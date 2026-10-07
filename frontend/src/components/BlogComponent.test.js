import React from 'react';
import { render, screen } from '@testing-library/react';
import BlogComponent from '../components/BlogComponent';
import { BrowserRouter as Router } from 'react-router-dom';

// Mock the images required for the food items
jest.mock('../assets/ugali.jpg', () => 'ugali.jpg');
jest.mock('../assets/sukuma-wiki.jpg', () => 'sukuma-wiki.jpg');
jest.mock('../assets/nyama-choma.jpg', () => 'nyama-choma.jpg');
jest.mock('../assets/chapati.jpg', () => 'chapati.jpg');
jest.mock('../assets/mandazi.jpg', () => 'mandazi.jpg');
jest.mock('../assets/githeri.jpg', () => 'githeri.jpg');
jest.mock('../assets/samaki.jpg', () => 'samaki.jpg');
jest.mock('../assets/kachumbari.jpg', () => 'kachumbari.jpg');
jest.mock('../assets/pilau.jpg', () => 'pilau.jpg');
jest.mock('../assets/biriani.jpg', () => 'biriani.jpg');
jest.mock('../assets/matoke.jpg', () => 'matoke.jpg');
jest.mock('../assets/irio.jpg', () => 'irio.jpg');
jest.mock('../assets/kenyan-beef-stew.jpg', () => 'kenyan-beef-stew.jpg');
jest.mock('../assets/wali-wa-nazi.jpg', () => 'wali-wa-nazi.jpg');
jest.mock('../assets/tilapia.jpg', () => 'tilapia.jpg');

describe('BlogComponent Tests', () => {
    
    test('renders the navigation links correctly', () => {
        render(
            <Router>
                <BlogComponent />
            </Router>
        );
    
        const links = [
            { name: 'Dashboard', href: '/dashboard' },
            { name: 'Account', href: '/account' },
            { name: 'Meals', href: '/meal-plansform' },
            { name: 'Meal-Plans', href: '/view-meal-plans' },
            { name: 'Metrics', href: '/metrics' },
            { name: 'Comparison', href: '/metrics-comparison' },
        ];
    
        links.forEach(({ name, href }) => {
            const linkElement = screen.getByRole('link', { name });
            expect(linkElement).toHaveAttribute('href', href);
        });
    });

    test('renders all food items correctly', () => {
        render(
            <Router>
                <BlogComponent />
            </Router>
        );

        const foodNames = [
            'Ugali', 'Sukuma Wiki', 'Nyama Choma', 'Chapati', 'Mandazi',
            'Githeri', 'Samaki', 'Kachumbari', 'Pilau', 'Biriani',
            'Matoke', 'Irio', 'Kenyan Beef Stew', 'Wali wa Nazi', 'Tilapia'
        ];

        foodNames.forEach((name) => {
            expect(screen.getByText(name)).toBeInTheDocument();
        });
    });

    test('renders all food descriptions correctly', () => {
        render(
            <Router>
                <BlogComponent />
            </Router>
        );

        const foodDescriptions = [
            /Ugali is the national dish of Kenya, made from maize flour/,
            /Sukuma Wiki, a nutritious and ubiquitous dish in Kenyan homes/,
            /Nyama Choma, which means "grilled meat" in Swahili/,
            /Chapati, a type of unleavened flatbread from the Indian subcontinent/,
            /Mandazi, also known as the Swahili bun or doughnut/,
            /Githeri is a traditional Kenyan dish originally from the Kikuyu tribe/,
            /Samaki, which means "fish" in Swahili/,
            /Kachumbari is a fresh tomato and onion salad/,
            /Pilau is a fragrant rice dish cooked with spices/,
            /Biriani is an aromatic and colorful rice dish/,
            /Matoke refers to a dish of starchy bananas/,
            /Irio is another traditional Kikuyu dish/,
            /Kenyan Beef Stew is a hearty dish made with chunks of beef/,
            /Wali wa Nazi is a coconut rice dish/,
            /Tilapia is a type of fish commonly found in Kenyan waters/
        ];

        foodDescriptions.forEach((description) => {
            expect(screen.getByText(description)).toBeInTheDocument();
        });
    });

    test('renders images for each food item', () => {
        render(
            <Router>
                <BlogComponent />
            </Router>
        );
    
        const foodAltTexts = [
            'Ugali', 'Sukuma Wiki', 'Nyama Choma', 'Chapati', 'Mandazi',
            'Githeri', 'Samaki', 'Kachumbari', 'Pilau', 'Biriani',
            'Matoke', 'Irio', 'Kenyan Beef Stew', 'Wali wa Nazi', 'Tilapia'
        ];
    
        foodAltTexts.forEach((altText) => {
            const imgElement = screen.getByAltText(altText);
            expect(imgElement).toBeInTheDocument();
        });
    });
});