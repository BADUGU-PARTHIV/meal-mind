const express = require('express');
const router = express.Router();

const {
    searchMealController,
    getMealByIdController
} = require('../controllers/mealDbController');

router.get('/search/:meal', searchMealController);

router.get('/:id', getMealByIdController);

module.exports = router;