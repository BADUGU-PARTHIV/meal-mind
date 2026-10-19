const express = require('express');

const router = express.Router();

const authMiddleware =
require('../middleware/authMiddleware');

const {

    getDashboardSummary,

    getWeeklyCalories

} = require('../controllers/dashboardController');

router.get(

    '/dashboard/summary',

    authMiddleware,

    getDashboardSummary

);

router.get(

    '/dashboard/weekly-calories',

    authMiddleware,

    getWeeklyCalories

);

module.exports = router;