import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/AccountComponent.css';
import logo from '../assets/logo.jpeg';

const AccountOptions = () => {
    return (
        <div className="account-container">
            <nav className="account-nav">
                <div className="logo-container">
                    <img src={logo} alt="NutriKids Logo" className="logo" />
                </div>
                <Link to="/dashboard" className="nav-link">Dashboard</Link>
                <Link to="/blog" className="nav-link">Blog</Link>
                <Link to="/meal-plansform" className="nav-link">Meals</Link>
                <Link to="/view-meal-plans" className="nav-link">Meal-Plans</Link>
                <Link to="/metrics" className="nav-link">Metrics</Link>
                <Link to="/metrics-comparison" className="nav-link">Comparison</Link>
            </nav>
            <div className="account-options">
                <h2>Account Management</h2>
                <ul>
                    <li><Link to="/edit-profile">Edit Profile</Link></li>
                    <li><Link to="/add-child">Add Child</Link></li>
                </ul>
            </div>
        </div>
    );
};

export default AccountOptions;