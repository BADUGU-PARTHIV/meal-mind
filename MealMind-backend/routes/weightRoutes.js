const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const { getWeights, addWeight } = require('../controllers/weightController');

const router = express.Router();

router.get('/weights', authMiddleware, getWeights);
router.post('/weights', authMiddleware, addWeight);

module.exports = router;
