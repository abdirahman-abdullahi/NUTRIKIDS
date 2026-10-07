// src/components/HomeComponent.js

import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/HomeComponent.css';

const HomeComponent = () => {
    return (
        <div className="home-page">
            <nav className="nav-bar">
                <div className="nav-links">
                    <Link to="/login" className="nav-link">Sign In</Link>
                    <Link to="/register" className="nav-link signup-button">Sign Up</Link>
                </div>
            </nav>
            <div className="content">
                <h1>Healthy Meals, Delivered to Your Kids</h1>
                <p>Convenient, nutritious meals tailored to your child's dietary needs.</p>
            </div>
        </div>
    );
};

export default HomeComponent;