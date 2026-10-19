const express =
require('express');

const router =
express.Router();

const {

fetchRecipes,
fetchRecipeDetails,
fetchIngredients

}
=
require(
'../controllers/recipeController'
);

router.get(
'/',
fetchRecipes
);

router.get(
'/:id',
fetchRecipeDetails
);

router.get(
'/:id/ingredients',
fetchIngredients
);

module.exports =
router;