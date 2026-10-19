const express =
require('express');

const router =
express.Router();

const authMiddleware =
require('../middleware/authMiddleware');

const {
getUserNutritionPlan,
updateUserNutritionPlan
} = require(
'../controllers/nutritionPlanController'
);

router.get(
'/',
authMiddleware,
getUserNutritionPlan
);

router.put(
'/',
authMiddleware,
updateUserNutritionPlan
);

module.exports = router;
