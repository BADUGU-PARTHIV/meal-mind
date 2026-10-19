const express = require('express');
const router = express.Router();

const authMiddleware = require('../middleware/authMiddleware');

const {
    createPantryItem,
    getPantryItems,
    updatePantryItem,
    adjustPantryQuantity,
    deletePantryItem,
    getLowStock,
    getPurchaseSuggestions,
    purchaseItem,
    addMissingIngredients
} = require('../controllers/pantryController');

router.post('/pantry', authMiddleware, createPantryItem);
router.get('/pantry', authMiddleware, getPantryItems);
router.put('/pantry/:id', authMiddleware, updatePantryItem);
router.patch('/pantry/:id/quantity', authMiddleware, adjustPantryQuantity);
router.delete('/pantry/:id', authMiddleware, deletePantryItem);
router.get('/pantry/low-stock', authMiddleware, getLowStock);
router.get('/pantry/purchase-suggestions',authMiddleware,getPurchaseSuggestions);
router.post('/pantry/purchase',authMiddleware,purchaseItem);
router.post('/pantry/add-missing',authMiddleware,addMissingIngredients);
module.exports = router;
