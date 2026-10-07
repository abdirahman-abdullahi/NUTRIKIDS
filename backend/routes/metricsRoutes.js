// backend/routes/metricsRoutes.js
const express = require('express');
const { addOrUpdateMetrics, getMetricsByChildId} = require('../controllers/metricsController');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/', authMiddleware, addOrUpdateMetrics);  
router.get('/:child_id', authMiddleware, getMetricsByChildId);

module.exports = router;