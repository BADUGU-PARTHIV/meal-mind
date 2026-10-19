const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const { getWater, addWater } = require('../controllers/waterController');

const router = express.Router();

router.get('/water', authMiddleware, getWater);
router.post('/water', authMiddleware, addWater);

module.exports = router;
