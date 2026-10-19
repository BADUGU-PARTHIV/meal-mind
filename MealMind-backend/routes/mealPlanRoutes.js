const express = require('express');
console.log("MEAL PLAN ROUTES LOADED");
const router = express.Router();

const authMiddleware =
require('../middleware/authMiddleware');

const {

    getTodayMealPlan,

    regenerateMealRecipe

} = require(
    '../controllers/mealPlanController'
);

router.get(
    '/today',
    authMiddleware,
    getTodayMealPlan
);

router.post(
    '/regenerate',
    authMiddleware,
    regenerateMealRecipe
);
console.log("REGISTERED POST /regenerate");
module.exports = router;