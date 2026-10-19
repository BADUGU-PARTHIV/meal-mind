const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');

const {
    createShoppingItem,
    getShoppingItems,
    updateShoppingItem,
    deleteShoppingItem,
    transferShoppingToPantry
} = require('../controllers/shoppingController');

router.post('/shoppinglist', authMiddleware, createShoppingItem);
router.get('/shoppinglist', authMiddleware, getShoppingItems);
router.put('/shoppinglist/:id', authMiddleware, updateShoppingItem);
router.delete('/shoppinglist/:id', authMiddleware, deleteShoppingItem);
router.post(
    '/shoppinglist/transfer',
    authMiddleware,
    transferShoppingToPantry
);
module.exports = router;