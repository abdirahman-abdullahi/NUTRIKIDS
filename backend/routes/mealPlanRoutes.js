const express = require('express');
const router = express.Router();
const mealPlanController = require('../controllers/mealPlanController');

router.post('/', mealPlanController.addMealPlan);
router.get('/:child_id', mealPlanController.getMealPlansByChildId);

module.exports = router;