const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const {
    getStatistics
} = require('../controllers/statisticsController');

const router = express.Router();

router.get(
    '/statistics',
    authMiddleware,
    getStatistics
);

module.exports = router;
