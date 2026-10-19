const express = require('express');
const authMiddleware =
require('../middleware/authMiddleware');
const router = express.Router();

const {
    createMonthlyShoppingList
} = require(
    '../controllers/monthlyShoppingListController'
);

router.post(
    '/generate',
    authMiddleware,
    createMonthlyShoppingList
);

module.exports = router;