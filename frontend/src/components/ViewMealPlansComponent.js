import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import logo from '../assets/logo.jpeg'; // Adjust path as necessary
import '../styles/ViewMealPlansComponent.css';

const ViewMealPlansComponent = () => {
    const { user } = useContext(UserContext);
    const [children, setChildren] = useState([]);
    const [selectedChildId, setSelectedChildId] = useState('');
    const [selectedChildName, setSelectedChildName] = useState('');
    const [mealPlans, setMealPlans] = useState([]);

    useEffect(() => {
        const fetchChildren = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                console.error('No token found');
                return;
            }

            try {
                const response = await fetch('http://localhost:5001/api/child/get-children', {
                    headers: { 'Authorization': `Bearer ${token}` },
                });

                if (!response) {
                    console.error('No response received');
                    return;
                }

                if (!response.ok) {
                    console.error('Failed to fetch children:', response.status);
                    return;
                }

                const data = await response.json();
                setChildren(data.map(child => ({
                    ...child,
                    id: child.id.toString(),
                    name: child.child_name
                })));
            } catch (error) {
                console.error('Error fetching children:', error);
            }
        };

        fetchChildren();
    }, [user]);

    useEffect(() => {
        if (selectedChildId) {
            const fetchMealPlans = async () => {
                const token = localStorage.getItem('token');
                try {
                    const response = await fetch(`http://localhost:5001/api/mealplans/${selectedChildId}`, {
                        headers: { 'Authorization': `Bearer ${token}` },
                    });

                    if (!response) {
                        console.error('No response received for meal plans');
                        return;
                    }

                    if (!response.ok) {
                        console.error('Failed to fetch meal plans:', response.status);
                        return;
                    }

                    const data = await response.json();
                    setMealPlans(data);
                } catch (error) {
                    console.error('Error fetching meal plans:', error);
                }
            };

            fetchMealPlans();
        }
    }, [selectedChildId]);

    const handleChildChange = (e) => {
        const selectedId = e.target.value;
        setSelectedChildId(selectedId);
        const child = children.find(c => c.id === selectedId);
        setSelectedChildName(child ? child.name : '');
    };

    return (
        <div className="view-meal-plans-container">
            <nav className="dashboard-nav">
                <div className="logo-container">
                    <img src={logo} alt="NutriKids Logo" className="logo" />
                </div>
                <div className="nav-links">
                    <Link to="/account" className="nav-link">Account</Link>
                    <Link to="/meal-plansform" className="nav-link">Meals</Link>
                    <Link to="/view-meal-plans" className="nav-link">Meal-Plans</Link>
                    <Link to="/blog" className="nav-link">Blog</Link>
                    <Link to="/metrics" className="nav-link">Metrics</Link>
                    <Link to="/metrics-comparison" className="nav-link">Comparison</Link>
                </div>
            </nav>
            <div className="view-meal-plans">
                <h1>View Meal Plans</h1>
                <label htmlFor="child">Select Child:</label>
                <select id="child" name="child" onChange={handleChildChange} value={selectedChildId}>
                    <option value="">Select a child</option>
                    {children.map(child => (
                        <option key={child.id} value={child.id}>{child.name}</option>
                    ))}
                </select>

                {mealPlans.length > 0 ? (
                    <div>
                        <h2>Meal Plans for {selectedChildName}</h2>
                        <ul>
                            {mealPlans.map(plan => (
                                <li key={plan.plan_id}>
                                    <p>Breakfast Item: {plan.breakfast_item_name}</p>
                                    <p>Breakfast Drink: {plan.breakfast_drink_name}</p>
                                    <p>Lunch Item: {plan.lunch_item_name}</p>
                                    <p>Lunch Drink: {plan.lunch_drink_name}</p>
                                    <p>Dinner Item: {plan.dinner_item_name}</p>
                                    <p>Dinner Drink: {plan.dinner_drink_name}</p>
                                    <p>Date Created: {plan.date_created}</p>
                                </li>
                            ))}
                        </ul>
                    </div>
                ) : (
                    <p>No meal plans available for this child.</p>
                )}
            </div>
        </div>
    );
};

export default ViewMealPlansComponent;