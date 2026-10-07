import React, { useState, useContext, useEffect } from 'react';
import { UserContext } from '../context/UserContext';
import '../styles/MetricsComparison.css';

function MetricsComparison() {
    const { user } = useContext(UserContext);
    const [children, setChildren] = useState([]);
    const [selectedChild, setSelectedChild] = useState(null);
    const [updatedMetrics, setUpdatedMetrics] = useState([]);

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

    useEffect(() => {
        if (selectedChild) {
            fetchUpdatedMetrics(selectedChild.id);
        }
    }, [selectedChild]);

    const calculateBMI = (weight, height) => {
        if (height > 0 && weight > 0) {
            return (weight / (height / 100) ** 2).toFixed(2);
        }
        return 'N/A';
    };

    const handleSelectChild = (child) => {
        child.bmi = calculateBMI(child.weight, child.height);  // Calculate BMI when a child is selected
        setSelectedChild(child);
    };

    const fetchUpdatedMetrics = async (childId) => {
        const token = localStorage.getItem('token');
        try {
            const response = await fetch(`http://localhost:5001/api/metrics/${childId}`, {
                headers: { 'Authorization': `Bearer ${token}` },
            });
    
            if (!response.ok) {
                throw new Error(`Failed to fetch updated metrics: ${response.statusText}`);
            }
    
            const data = await response.json();
            console.log("Received Updated Metrics Data:", data); // Log the data to inspect its structure
    
            // Flatten the data if it is indeed an array of arrays
            if (Array.isArray(data) && data.every(item => Array.isArray(item))) {
                const flattenedData = data.reduce((acc, val) => acc.concat(val), []);
                console.log("Flattened Updated Metrics Data:", flattenedData); // Log the flattened data
                setUpdatedMetrics(flattenedData);
            } else {
                console.error("Data is not in expected array of arrays format:", data);
            }
        } catch (error) {
            console.error('Error fetching updated metrics:', error);
        }
    };

    return (
        <div className="metrics-comparison">
            <h1>Metrics Comparison</h1>
            <select
                value={selectedChild ? selectedChild.id : ''}
                onChange={e => {
                    const child = children.find(child => child.id === parseInt(e.target.value));
                    handleSelectChild(child);
                }}
                required>
                <option value="">Select a child</option>
                {children.map(child => (
                    <option key={child.id} value={child.id}>{child.child_name}</option>
                ))}
            </select>
            {selectedChild && (
                <div>
                    <h2>Original Metrics for {selectedChild.child_name}</h2>
                    <p>Height: {selectedChild.height || 'N/A'} cm</p>
                    <p>Weight: {selectedChild.weight || 'N/A'} kg</p>
                    <p>BMI: {selectedChild.bmi}</p>  {/* Display calculated BMI */}
                </div>
            )}
            {updatedMetrics.length > 0 && (
                <div>
                    <h2>Updated Metrics</h2>
                    {updatedMetrics.map((metric, index) => (
                        <div key={index}>
                            <p>Date Recorded: {metric.date_recorded}</p>
                            <p>Height: {metric.height} cm</p>
                            <p>Weight: {metric.weight} kg</p>
                            <p>BMI: {metric.bmi}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default MetricsComparison;