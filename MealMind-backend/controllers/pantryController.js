const db = require('../config/db');
const {
    addPantryItem,
    getPantryItemsByUserId,
    updatePantryItemById,
    deletePantryItemById,
    getLowStockItems,
    increasePantryQuantity,
    adjustPantryQuantityById
} = require('../models/pantryModel');

const allowedUnits = new Set(['kg', 'g', 'pcs']);

const validatePantryItem = (data) => {
    const itemName = String(data.item_name || '').trim();
    const quantity = Number(data.quantity);
    const threshold = Number(data.low_stock_threshold);
    const unit = String(data.unit || '').trim().toLowerCase();

    if (!itemName) return 'Item name is required';
    if (itemName.length > 255) return 'Item name is too long';
    if (
        data.quantity === '' ||
        data.quantity === null ||
        data.quantity === undefined
    ) {
        return 'Quantity is required';
    }
    if (!Number.isFinite(quantity) || quantity < 0) {
        return 'Quantity must be zero or greater';
    }
    if (!allowedUnits.has(unit)) return 'Invalid pantry unit';
    if (
        data.low_stock_threshold === '' ||
        data.low_stock_threshold === null ||
        data.low_stock_threshold === undefined
    ) {
        return 'Low-stock threshold is required';
    }
    if (!Number.isFinite(threshold) || threshold < 0) {
        return 'Low-stock threshold must be zero or greater';
    }

    return null;
};

const createPantryItem = (req, res) => {

    const validationError = validatePantryItem(req.body);

    if (validationError) {
        return res.status(400).json({ message: validationError });
    }

    const itemData = {
        user_id: req.user.id,
        item_name: req.body.item_name.trim(),
        quantity: Number(req.body.quantity),
        unit: req.body.unit.toLowerCase(),
        low_stock_threshold: Number(req.body.low_stock_threshold)
    };

    addPantryItem(itemData, (err, result) => {

        if (err) {
            if (err.code === 'ER_DUP_ENTRY') {
                return res.status(409).json({
                    message:
                        'This item already exists. Use the quantity controls to update it.'
                });
            }
            return res.status(500).json({
                message: 'Failed To Add Pantry Item'
            });
        }

        res.status(201).json({
            message: 'Pantry Item Added Successfully'
        });

    });

};
const getPantryItems = (req, res) => {

    getPantryItemsByUserId(req.user.id, (err, results) => {

        if (err) {
            return res.status(500).json({
                message: 'Database Error'
            });
        }

        res.status(200).json(results);

    });

};
const updatePantryItem = (req, res) => {

    const validationError = validatePantryItem(req.body);

    if (validationError) {
        return res.status(400).json({ message: validationError });
    }

    const itemData = {
        ...req.body,
        item_name: req.body.item_name.trim(),
        quantity: Number(req.body.quantity),
        unit: req.body.unit.toLowerCase(),
        low_stock_threshold: Number(req.body.low_stock_threshold)
    };

    updatePantryItemById(
        req.params.id,
        req.user.id,
        itemData,
        (err, result) => {

            if (err) {
                if (err.code === 'ER_DUP_ENTRY') {
                    return res.status(409).json({
                        message: 'Another pantry item already uses this name'
                    });
                }
                return res.status(500).json({
                    message: 'Update Failed'
                });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    message: 'Pantry item not found'
                });
            }

            res.json({
                message: 'Pantry Item Updated Successfully'
            });

        }
    );

};

const adjustPantryQuantity = (req, res) => {

    const delta = Number(req.body.delta);

    if (!Number.isFinite(delta) || delta === 0) {
        return res.status(400).json({
            message: 'A valid quantity change is required'
        });
    }

    adjustPantryQuantityById(
        req.params.id,
        req.user.id,
        delta,
        (err, result) => {

            if (err) {
                return res.status(500).json({
                    message: 'Quantity Update Failed'
                });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    message: 'Pantry item not found'
                });
            }

            res.json({
                message: 'Pantry Quantity Updated Successfully'
            });

        }
    );

};

const deletePantryItem = (req, res) => {

    deletePantryItemById(
        req.params.id,
        req.user.id,
        (err, result) => {

            if (err) {
                return res.status(500).json({
                    message: 'Delete Failed'
                });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    message: 'Pantry item not found'
                });
            }

            res.json({
                message: 'Pantry Item Deleted Successfully'
            });

        }
    );

};

const getLowStock = (req, res) => {

    getLowStockItems(req.user.id, (err, results) => {

        if (err) {
            return res.status(500).json({
                message: 'Database Error'
            });
        }

        res.status(200).json(results);

    });

};
const getPurchaseSuggestions = (req, res) => {

    getLowStockItems(
        req.user.id,
        (err, results) => {

            if (err) {
                return res.status(500).json({
                    message: 'Database Error'
                });
            }

            const suggestions =
                results.map(item => ({

                    item_name:
                        item.item_name,

                    suggested_quantity:
                        item.low_stock_threshold * 5,

                    unit:
                        item.unit

                }));

            res.json(
                suggestions
            );

        }
    );

};
const purchaseItem = (req, res) => {

    const quantity = Number(req.body.quantity);

    if (
        !String(req.body.item_name || '').trim() ||
        !Number.isFinite(quantity) ||
        quantity <= 0
    ) {
        return res.status(400).json({
            message: 'A pantry item and positive quantity are required'
        });
    }

    increasePantryQuantity(
        req.user.id,
        req.body.item_name.trim(),
        quantity,
        (err, result) => {

            if (err) {
                return res.status(500).json({
                    message: 'Purchase Failed'
                });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    message: 'Pantry item not found'
                });
            }

            res.json({
                message:
                    'Pantry Updated Successfully'
            });

        }
    );

};
const addMissingIngredients = (req, res) => {

    const userId = req.user.id;

    const ingredients = req.body.ingredients;

    if (!ingredients || ingredients.length === 0) {

        return res.status(400).json({

            message: 'No Ingredients'

        });

    }

    const invalidIngredient = ingredients.some(item =>
        !String(item.name || '').trim() ||
        !Number.isFinite(Number(item.quantity_g)) ||
        Number(item.quantity_g) <= 0
    );

    if (invalidIngredient) {
        return res.status(400).json({
            message: 'Every ingredient needs a name and positive quantity'
        });
    }

    const values = ingredients.map(item => [

        userId,

        item.name.trim(),

        Number(item.quantity_g),

        'g',

        'Pending'

    ]);

    db.query(

        `
        INSERT INTO shopping_lists
        (
            user_id,
            item_name,
            quantity,
            unit,
            status
        )
        VALUES ?
        ON DUPLICATE KEY UPDATE

        quantity = quantity + VALUES(quantity)
        `,

        [values],

        (err) => {

            if (err) {

                console.log(err);

                return res.status(500).json({

                    message: 'Database Error'

                });

            }

            res.json({

                message:

                'Missing Ingredients Added'

            });

        }

    );

};
module.exports = {
    createPantryItem,
    getPantryItems,
    updatePantryItem,
    adjustPantryQuantity,
    deletePantryItem,
    getLowStock,
    getPurchaseSuggestions,
    purchaseItem,
    addMissingIngredients
};
