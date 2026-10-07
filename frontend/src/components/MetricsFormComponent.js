import React, { useState, useContext, useEffect } from 'react';
import { UserContext } from '../context/UserContext';
import '../styles/MetricsFormComponent.css';

export default function MetricsFormComponent({ onSave }) {
    const { user } = useContext(UserContext);
    const [children, setChildren] = useState([]);
    const [selectedChild, setSelectedChild] = useState('');
    const [metrics, setMetrics] = useState({
        dateRecorded: '',
        height: '',
        weight: ''
    });

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

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setMetrics({ ...metrics, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(selectedChild, metrics);
    };

    return (
        <div className="metrics-form">
            <h1>Manage Child Metrics</h1>
            <form onSubmit={handleSubmit}>
                <label>
                    Select Child:
                    <select value={selectedChild} onChange={e => setSelectedChild(e.target.value)} required>
                        <option value="">Select a child</option>
                        {children.map((child) => (
                            <option key={child.id} value={child.id}>{child.child_name}</option>
                        ))}
                    </select>
                </label>
                <input type="date" name="dateRecorded" value={metrics.dateRecorded} onChange={handleInputChange} required />
                <input type="number" name="height" placeholder="Height in cm" value={metrics.height} onChange={handleInputChange} required />
                <input type="number" name="weight" placeholder="Weight in kg" value={metrics.weight} onChange={handleInputChange} required />
                <button type="submit">Save Metrics</button>
            </form>
        </div>
    );
}