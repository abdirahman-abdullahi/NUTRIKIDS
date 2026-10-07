import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom'; // To handle Links in the component
import AccountOptions from '../components/AccountComponent'; // Assuming the component is named AccountComponent

describe('AccountOptions Component', () => {
  
  test('renders the NutriKids logo', () => {
    render(
      <Router>
        <AccountOptions />
      </Router>
    );
    const logo = screen.getByAltText('NutriKids Logo');
    expect(logo).toBeInTheDocument();
    expect(logo).toHaveAttribute('src', 'logo.jpeg'); // Checking if the image source is correct
  });

  test('renders navigation links', () => {
    render(
      <Router>
        <AccountOptions />
      </Router>
    );
    const dashboardLink = screen.getByRole('link', { name: /Dashboard/i });
    const blogLink = screen.getByRole('link', { name: /Blog/i });
    const mealsLink = screen.getByRole('link', { name: /Meals/i });
    const mealPlansLink = screen.getByRole('link', { name: /Meal-Plans/i });
    const metricsLink = screen.getByRole('link', { name: /Metrics/i });
    const comparisonLink = screen.getByRole('link', { name: /Comparison/i });

    expect(dashboardLink).toBeInTheDocument();
    expect(blogLink).toBeInTheDocument();
    expect(mealsLink).toBeInTheDocument();
    expect(mealPlansLink).toBeInTheDocument();
    expect(metricsLink).toBeInTheDocument();
    expect(comparisonLink).toBeInTheDocument();
  });

  test('renders account management options', () => {
    render(
      <Router>
        <AccountOptions />
      </Router>
    );
    const editProfileLink = screen.getByRole('link', { name: /Edit Profile/i });
    const addChildLink = screen.getByRole('link', { name: /Add Child/i });

    expect(editProfileLink).toBeInTheDocument();
    expect(addChildLink).toBeInTheDocument();
  });
});