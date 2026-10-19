const express = require('express');

const router = express.Router();

const {
    searchFoodController
} = require('../controllers/usdaController');

router.get(
    '/search/:food',
    searchFoodController
);

module.exports = router;