// src/components/EditProfileComponent.js

import React, { useState, useContext } from 'react';
import { UserContext } from '../context/UserContext';
import '../styles/EditProfileComponent.css';

const EditProfileComponent = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [editType, setEditType] = useState('');
    const [confirmChange, setConfirmChange] = useState(false);

    const { user } = useContext(UserContext); // Access the user from context

    const handleTogglePassword = () => {
        setShowPassword(!showPassword);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!confirmChange) {
            alert('Please confirm that you want to make this change.');
            return;
        }

        if (editType === 'password' && password !== confirmPassword) {
            alert('Passwords do not match');
            return;
        }

        const updateData = {
            ...(editType === 'email' && { email }),
            ...(editType === 'password' && { password }),
        };

        try {
            const response = await fetch('http://localhost:5001/api/auth/update-profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`, // Include token in headers
                },
                body: JSON.stringify(updateData),
            });

            const data = await response.json();

            if (response.ok) {
                alert('Profile updated successfully!');
                // Reset form
                setEmail('');
                setPassword('');
                setConfirmPassword('');
                setConfirmChange(false);
            } else {
                alert(`Update failed: ${data.message}`);
            }
        } catch (error) {
            console.error('Error during update:', error);
            alert('Error during update.');
        }
    };

    return (
        <div className="edit-profile-page">
            <div className="edit-profile-container">
                <h2>Edit Profile</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="editType">What would you like to update?</label>
                        <select
                            id="editType"
                            value={editType}
                            onChange={(e) => setEditType(e.target.value)}
                            required
                        >
                            <option value="">Select an option</option>
                            <option value="email">Email</option>
                            <option value="password">Password</option>
                        </select>
                    </div>

                    {editType === 'email' && (
                        <div className="form-group">
                            <label htmlFor="email">New Email</label>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                    )}

                    {editType === 'password' && (
                        <>
                            <div className="form-group">
                                <label htmlFor="password">New Password</label>
                                <div className="password-input">
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        id="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        pattern="^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$"
                                        title="Must contain at least 8 characters, one letter, one number, and one special character"
                                    />
                                    <span
                                        className="toggle-password"
                                        onClick={handleTogglePassword}
                                    >
                                        {showPassword ? '🙈' : '👁️'}
                                    </span>
                                </div>
                            </div>
                            <div className="form-group">
                                <label htmlFor="confirmPassword">Confirm Password</label>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    id="confirmPassword"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                />
                            </div>
                        </>
                    )}

                    <div className="form-group">
                        <input
                            type="checkbox"
                            id="confirmChange"
                            checked={confirmChange}
                            onChange={(e) => setConfirmChange(e.target.checked)}
                        />
                        <label htmlFor="confirmChange">I confirm that I want to make this change</label>
                    </div>

                    <button type="submit">Update</button>
                </form>
            </div>
        </div>
    );
};

export default EditProfileComponent;