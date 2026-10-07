// src/components/LoginComponent.js

import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import '../styles/LoginComponent.css';

const LoginComponent = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
    const { setUser } = useContext(UserContext);

    const handleTogglePassword = () => {
        setShowPassword(!showPassword);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("Attempting to login...", { email, password });
    
        try {
            const response = await fetch('http://localhost:5001/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });
    
            console.log("Login response received", response);
    
            if (!response.ok) {
                throw new Error(`Login failed: ${response.status} - ${await response.text()}`);
            }
    
            const data = await response.json();
            console.log("Login successful, received token", data);
    
            // Clear any existing token
            localStorage.removeItem('token');
    
            // Save new token
            localStorage.setItem('token', data.token);
    
            console.log("Token stored, fetching user data...");
    
            // Fetch and set user data in context
            const userResponse = await fetch('http://localhost:5001/api/auth/user', {
                headers: {
                    'Authorization': `Bearer ${data.token}`,
                },
            });
    
            if (!userResponse.ok) {
                throw new Error('Failed to fetch user details');
            }
    
            const userData = await userResponse.json();
            console.log("User data fetched", userData);
            setUser(userData);
    
            console.log("User set in context, navigating to dashboard...");
            navigate('/dashboard');  // Navigate to the dashboard for all users
        } catch (error) {
            console.error('Error during login:', error);
            alert(error.message || 'Error during login.');
        }
    };

    return (
        <div className="login-page">
            <div className="login-container">
                <h2>Login</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <div className="password-input">
                            <input
                                type={showPassword ? "text" : "password"}
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <span
                                className="toggle-password"
                                onClick={handleTogglePassword}
                            >
                                {showPassword ? "🙈" : "👁️"}
                            </span>
                        </div>
                    </div>
                    <button type="submit">Login</button>
                    <p>
                        Don't have an account? <Link to="/register">Register here</Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default LoginComponent;