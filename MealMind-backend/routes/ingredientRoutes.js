const express = require('express');
const router = express.Router();

const authMiddleware = require('../middleware/authMiddleware');

const {
    getMealIngredients,
    markIngredientConsumed
} = require('../controllers/ingredientController');

router.get(
    '/ingredient/meal/:mealId',
    authMiddleware,
    getMealIngredients
);

router.put(
    '/ingredient/:id/consume',
    authMiddleware,
    markIngredientConsumed
);

module.exports = router;