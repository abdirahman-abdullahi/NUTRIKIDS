import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import ChildCard from '../components/ChildCard';
import logo from '../assets/logo.jpeg';
import { UserContext } from '../context/UserContext';
import '../styles/DashboardComponent.css';

const calculateAge = (dob) => {
    const birthDate = new Date(dob);
    const difference = Date.now() - birthDate.getTime();
    const ageDate = new Date(difference);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
};

const calculateBMI = (weight, height) => {
    return (weight / ((height / 100) ** 2)).toFixed(2);
};

const generateRecommendations = (age, bmi) => {
    let recommendations = [];
    if (bmi >= 25) {
        recommendations.push("Reduce intake of carbohydrates and increase physical activity.");
        recommendations.push("Include more high-fiber foods such as fruits and vegetables.");
    } else if (bmi < 18.5) {
        recommendations.push("Increase caloric intake with nutrient-rich foods.");
        recommendations.push("Consider adding more proteins and healthy fats to the diet.");
    } else {
        recommendations.push("Maintain a balanced diet with a variety of food groups.");
    }

    if (age >= 5 && age <= 8) {
        recommendations.push("Ensure adequate calcium intake for bone development.");
    } else if (age > 8 && age <= 12) {
        recommendations.push("Focus on iron-rich foods to support growth spurts.");
    } else {
        recommendations.push("Monitor and maintain vitamin D levels for healthy adolescent development.");
    }

    return recommendations;
};

const DashboardComponent = () => {
    const { user } = useContext(UserContext);
    const [children, setChildren] = useState([]);
    const [selectedChild, setSelectedChild] = useState(null);

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

                if (!response.ok) {
                    console.error('Failed to fetch children:', response.status);
                    return;
                }

                const data = await response.json();
                setChildren(data);
            } catch (error) {
                console.error('Error fetching children:', error);
            }
        };

        fetchChildren();
    }, [user]);

    const handleCardClick = (child) => {
        const bmi = calculateBMI(child.weight, child.height);
        const recommendations = generateRecommendations(calculateAge(child.dob), bmi);
        setSelectedChild({ ...child, recommendations, bmi });
    };

    return (
        <div className="dashboard-page">
            <nav className="dashboard-nav">
                <img src={logo} alt="NutriKids Logo" className="navbar-logo" />
                <div className="nav-links">
                    <Link to="/account" className="nav-link">Account</Link>
                    <Link to="/meal-plansform" className="nav-link">Meals</Link>
                    <Link to="/view-meal-plans" className="nav-link">Meal-Plans</Link>
                    <Link to="/blog" className="nav-link">Blog</Link>
                    <Link to="/metrics" className="nav-link">Metrics</Link>
                    <Link to="/metrics-comparison" className="nav-link">Comparison</Link>
                </div>
            </nav>

            <div className="dashboard-content">
                <h1>Welcome to NutriKids</h1>
                <p>Your personalized hub for healthy living and meal planning.</p>

                <h2>Your Children</h2>
                <div className="children-cards">
                    {children.map((child) => (
                        <ChildCard 
                            key={child.id} 
                            child={child}
                            onClick={() => handleCardClick(child)}
                        />
                    ))}
                </div>
            </div>

            {selectedChild && (
                <div className="child-popup">
                    <h3>{selectedChild.child_name}</h3>
                    <p>Age: {calculateAge(selectedChild.dob)}</p>
                    <p>Weight: {selectedChild.weight} kg</p>
                    <p>Height: {selectedChild.height} cm</p>
                    <p>BMI: {selectedChild.bmi} ({selectedChild.bmi < 18.5 ? 'Underweight' : selectedChild.bmi <= 24.9 ? 'Normal weight' : 'Overweight'})</p>
                    <p>Recommendations: {selectedChild.recommendations.join(", ")}</p>
                    <button onClick={() => setSelectedChild(null)}>Close</button>
                </div>
            )}
        </div>
    );
};

export default DashboardComponent;