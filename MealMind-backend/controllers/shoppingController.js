const db =
require('../config/db');
const {
    addShoppingItem,
    getShoppingItemsByUserId,
    updateShoppingItemById,
    deleteShoppingItemById
} = require('../models/shoppingModel');
const createShoppingItem = (req, res) => {

    const itemData = {
        user_id: req.user.id,
        item_name: req.body.item_name,
        quantity: req.body.quantity,
        unit: req.body.unit,
        status: req.body.status || 'Pending'
    };

    addShoppingItem(itemData, (err, result) => {

        if (err) {
            return res.status(500).json({
                message: 'Failed To Add Item'
            });
        }

        res.status(201).json({
            message: 'Item Added Successfully'
        });

    });

};
const getShoppingItems = (req, res) => {

    getShoppingItemsByUserId(req.user.id, (err, results) => {

        if (err) {
            return res.status(500).json({
                message: 'Database Error'
            });
        }

        res.status(200).json(results);

    });

};

const updateShoppingItem = (req, res) => {

    updateShoppingItemById(

        req.params.id,

        req.user.id,

        req.body,

        (err, result) => {

            if (err) {

                console.log(err);

                return res.status(500).json({
                    message: 'Update Failed'
                });

            }

            res.status(200).json({
                message: 'Item Updated Successfully'
            });

        }

    );

};

const deleteShoppingItem = (req, res) => {

    deleteShoppingItemById(
        req.params.id,
        req.user.id,
        (err, result) => {

            if (err) {
                return res.status(500).json({
                    message: 'Delete Failed'
                });
            }

            res.json({
                message: 'Item Deleted Successfully'
            });

        }
    );

};
const transferShoppingToPantry =
(req, res) => {

    const userId =
        req.user.id;

    db.query(

        `SELECT *
         FROM shopping_lists
         WHERE user_id = ?
         AND status = 'Purchased'`,

        [userId],

        (err, items) => {

            if (err) {

                return res.status(500).json({
                    message:
                    'Database Error'
                });

            }

            if (
                items.length === 0
            ) {

                return res.status(400).json({
                    message:
                    'No Purchased Items'
                });

            }

            db.beginTransaction((transactionError) => {

                if (transactionError) {
                    return res.status(500).json({
                        message: 'Transfer Failed'
                    });
                }

                const rollback = () => {
                    db.rollback(() => {
                        res.status(500).json({
                            message: 'Transfer Failed'
                        });
                    });
                };

                db.query(
                    `INSERT INTO pantry_items
                    (
                        user_id,
                        item_name,
                        quantity,
                        unit,
                        low_stock_threshold
                    )
                    SELECT
                        user_id,
                        item_name,
                        quantity,
                        unit,
                        GREATEST(quantity * 0.2, 1)
                    FROM shopping_lists
                    WHERE user_id = ?
                    AND status = 'Purchased'
                    ON DUPLICATE KEY UPDATE
                        quantity = pantry_items.quantity +
                            CASE
                                WHEN pantry_items.unit = VALUES(unit)
                                    THEN VALUES(quantity)
                                WHEN pantry_items.unit = 'kg'
                                    AND VALUES(unit) = 'g'
                                    THEN VALUES(quantity) / 1000
                                WHEN pantry_items.unit = 'g'
                                    AND VALUES(unit) = 'kg'
                                    THEN VALUES(quantity) * 1000
                                ELSE 0
                            END`,
                    [userId],
                    (insertError) => {

                        if (insertError) {
                            return rollback();
                        }

                        db.query(
                            `DELETE s
                             FROM shopping_lists s
                             LEFT JOIN pantry_items p
                                ON p.user_id = s.user_id
                                AND LOWER(TRIM(p.item_name)) =
                                    LOWER(TRIM(s.item_name))
                             WHERE s.user_id = ?
                             AND s.status = 'Purchased'
                             AND (
                                p.id IS NULL
                                OR p.unit = s.unit
                                OR (p.unit = 'kg' AND s.unit = 'g')
                                OR (p.unit = 'g' AND s.unit = 'kg')
                             )`,
                            [userId],
                            (deleteError) => {

                                if (deleteError) {
                                    return rollback();
                                }

                                db.commit((commitError) => {

                                    if (commitError) {
                                        return rollback();
                                    }

                                    res.json({
                                        message: 'Items Transferred'
                                    });

                                });

                            }
                        );

                    }
                );

            });

        }

    );

};
module.exports = {
    createShoppingItem,
    getShoppingItems,
    updateShoppingItem,
    deleteShoppingItem,
    transferShoppingToPantry
};
