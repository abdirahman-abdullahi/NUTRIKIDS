// backend/controllers/metricsController.js
const db = require('../config/db');

exports.addOrUpdateMetrics = async (req, res) => {
    const { child_id, date_recorded, height, weight } = req.body;
    const bmi = (weight / Math.pow(height / 100, 2)).toFixed(2); // Calculate BMI based on the provided height and weight

    try {
        // First, delete any existing metrics for this child on the given date
        await db.query('DELETE FROM child_metrics WHERE child_id = ? AND date_recorded = ?', [child_id, date_recorded]);
        // better to keep the initial records for reference later. If previous records are deleted there will be nothing for comparion.
        // Then, insert the new metrics
        await db.query('INSERT INTO child_metrics (child_id, date_recorded, height, weight, bmi) VALUES (?, ?, ?, ?, ?)', 
                       [child_id, date_recorded, height, weight, bmi]);

        res.json({ message: 'Metrics updated successfully' });
    } catch (error) {
        console.error('Error managing child metrics:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.getMetricsByChildId = async (req, res) => {
    const { child_id } = req.params;
    try {
        const metrics = await db.query('SELECT height, weight, bmi, date_recorded FROM child_metrics WHERE child_id = ?', [child_id]);
        if (metrics.length === 0) {
            return res.status(404).json({ message: 'No metrics found for this child' });
        }
        res.json(metrics);
    } catch (error) {
        console.error('Error fetching metrics:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};