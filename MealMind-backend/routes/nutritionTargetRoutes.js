const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {

    fetchNutritionTarget,

    updateNutritionTarget

} = require("../controllers/nutritionTargetController");

router.get(

    "/",

    authMiddleware,

    fetchNutritionTarget

);

router.post(

    "/",

    authMiddleware,

    updateNutritionTarget

);

module.exports = router;