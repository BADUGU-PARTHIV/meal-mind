const express = require("express");

const router = express.Router();

const authMiddleware =
require("../middleware/authMiddleware");

const {
    saveCustomMeal
} = require("../controllers/customMealController");

router.post(
    "/food/custom-meal",
    authMiddleware,
    saveCustomMeal
);

module.exports = router;