import React from 'react';
import MetricsFormComponent from '../components/MetricsFormComponent';

export default function MetricsPage() {
    const handleSaveMetrics = async (childId, metrics) => {
        console.log('Metrics for child ID:', childId, 'are', metrics);
    
        try {
            const response = await fetch('http://localhost:5001/api/metrics', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    child_id: childId,
                    date_recorded: metrics.dateRecorded,
                    height: metrics.height,
                    weight: metrics.weight
                })
            });
    
            if (!response.ok) {
                throw new Error('Failed to save metrics: ' + response.statusText);
            }
    
            const result = await response.json();
            console.log('Metrics saved successfully:', result);
            alert('Metrics saved successfully!');
        } catch (error) {
            console.error('Error saving metrics:', error);
            alert('Error saving metrics: ' + error.message);
        }
    };

    return (
        <div>
            <MetricsFormComponent onSave={handleSaveMetrics} />
        </div>
    );
}