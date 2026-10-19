const express = require('express');
const router = express.Router();

const authMiddleware = require('../middleware/authMiddleware');

const {
    addBudget
} = require('../controllers/budgetController');

router.post(
    '/budget',
    authMiddleware,
    addBudget
);

module.exports = router;