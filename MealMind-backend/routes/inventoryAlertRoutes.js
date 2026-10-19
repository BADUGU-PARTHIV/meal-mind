const express = require('express');

const router =
    express.Router();
const authMiddleware = require('../middleware/authMiddleware');

const {
    getAlerts
} = require(
    '../controllers/inventoryAlertController'
);

router.get(
    '/',
    authMiddleware,
    getAlerts
);

module.exports = router;