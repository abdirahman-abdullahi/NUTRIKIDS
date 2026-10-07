import React, { useState, useContext } from 'react';
import { UserContext } from '../context/UserContext';
import '../styles/AddChildComponent.css';

const AddChildComponent = () => {
    const { user } = useContext(UserContext);
    const [childName, setChildName] = useState('');
    const [dob, setDob] = useState('');
    const [weight, setWeight] = useState('');
    const [height, setHeight] = useState('');
    const token = localStorage.getItem('token');

    const calculateAge = (dob) => {
        const birthDate = new Date(dob);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();

        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const age = calculateAge(dob);
        if (age < 5 || age > 18) {
            alert('Only children between the ages of 5 and 18 years are eligible.');
            return;
        }

        if (weight < 10 || height < 70) { // Assuming 10 kg and 70 cm as minimums
            alert('Please check the weight and height; they seem too low.');
            return;
        }

        if (!user || !user.id) {
            alert('Parent ID is missing; please log in again.');
            return;
        }

        try {
            const response = await fetch('http://localhost:5001/api/child/register-child', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    parentId: user.id,
                    childName,
                    dob,
                    weight,
                    height
                }),
            });

            const data = await response.json();

            if (response.ok) {
                alert('Child registered successfully!');
                resetForm();
            } else {
                alert(`Registration failed: ${data.message}`);
            }
        } catch (error) {
            console.error('Error during child registration:', error);
            alert('Error during child registration.');
        }
    };

    const resetForm = () => {
        setChildName('');
        setDob('');
        setWeight('');
        setHeight('');
    };

    return (
        <div className="add-child-page">
            <div className="add-child-container">
                <h2>Add Child</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="childName">Child's Name</label>
                        <input
                            type="text"
                            id="childName"
                            value={childName}
                            onChange={(e) => setChildName(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="dob">Date of Birth</label>
                        <input
                            type="date"
                            id="dob"
                            value={dob}
                            onChange={(e) => setDob(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="weight">Weight (in kg)</label>
                        <input
                            type="number"
                            id="weight"
                            value={weight}
                            onChange={(e) => setWeight(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="height">Height (in cm)</label>
                        <input
                            type="number"
                            id="height"
                            value={height}
                            onChange={(e) => setHeight(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit">Add Child</button>
                </form>
            </div>
        </div>
    );
};

export default AddChildComponent;
