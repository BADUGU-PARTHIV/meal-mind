const db = require('../config/db');

const replaceShoppingList = (userId, items, callback) => {
    db.beginTransaction((transactionError) => {
        if (transactionError) {
            return callback(transactionError);
        }

        const rollback = (error) => {
            db.rollback(() => callback(error));
        };

        db.query(
            'DELETE FROM shopping_lists WHERE user_id = ?',
            [userId],
            (deleteError) => {
                if (deleteError) {
                    return rollback(deleteError);
                }

                if (items.length === 0) {
                    return db.commit((commitError) => {
                        if (commitError) {
                            return rollback(commitError);
                        }

                        callback(null);
                    });
                }

                const values = items.map((item) => [
                    userId,
                    item.item_name,
                    item.quantity,
                    item.unit,
                    'Pending'
                ]);

                db.query(
                    `INSERT INTO shopping_lists
                    (user_id, item_name, quantity, unit, status)
                    VALUES ?`,
                    [values],
                    (insertError) => {
                        if (insertError) {
                            return rollback(insertError);
                        }

                        db.commit((commitError) => {
                            if (commitError) {
                                return rollback(commitError);
                            }

                            callback(null);
                        });
                    }
                );
            }
        );
    });
};

module.exports = replaceShoppingList;
