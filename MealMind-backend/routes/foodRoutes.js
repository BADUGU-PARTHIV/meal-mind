const express = require('express');
const router = express.Router();

const authMiddleware = require('../middleware/authMiddleware');
const {
    createFood,
    undoCompletedMeal,
    getFoods,
    updateFood,
    deleteFood,
    resetTodayFoods
} = require('../controllers/foodController');

router.post('/foodlog', authMiddleware, createFood);
router.delete('/foodlog/today', authMiddleware, resetTodayFoods);
router.delete('/foodlog/:id/completion', authMiddleware, undoCompletedMeal);
router.get('/foodlog', authMiddleware, getFoods);
router.put('/foodlog/:id', authMiddleware, updateFood);
router.delete('/foodlog/:id', authMiddleware, deleteFood);
module.exports = router;
