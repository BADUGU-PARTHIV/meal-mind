const express = require('express');
const router = express.Router();

const authMiddleware = require('../middleware/authMiddleware');

const {
    fetchRecipes,
    fetchRecipeDetails,
    fetchIngredients,
    pantryStatus,
    fetchSimilarRecipes,
    createCustomRecipe
} = require('../controllers/recipeController');

router.get('/', authMiddleware, fetchRecipes);

router.post('/', authMiddleware, createCustomRecipe);

router.get('/:id', authMiddleware, fetchRecipeDetails);

router.get('/:id/ingredients', authMiddleware, fetchIngredients);

router.get('/:id/pantry', authMiddleware, pantryStatus);

router.get('/:id/similar', authMiddleware, fetchSimilarRecipes);

module.exports = router;
