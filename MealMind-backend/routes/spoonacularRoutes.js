const express = require('express');

const router = express.Router();

const {
    searchRecipeController
} = require('../controllers/spoonacularController');

router.get(
    '/search/:food',
    searchRecipeController
);

module.exports = router;