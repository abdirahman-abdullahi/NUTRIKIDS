// backend/routes/nutritionRoutes.js

const express = require('express');
const router = express.Router();
const nutritionController = require('../controllers/nutritionController');

router.post('/foods', nutritionController.addFood);
router.get('/foods',  nutritionController.getAllFoods);
router.put('/foods/:id', nutritionController.updateFood);
router.delete('/foods/:id', nutritionController.deleteFood);
router.get('/foods/category/:category', nutritionController.getFoodsByCategory);


module.exports = router;