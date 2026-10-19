const db = require('../config/db');

const generateMonthlyShoppingList = (
    userId,
    callback
) => {

    const getIngredientsSql = `
        SELECT
            ingredient_name,
            unit,
            SUM(quantity) AS total_quantity
        FROM meal_ingredient_usage
        WHERE user_id = ?
        GROUP BY ingredient_name, unit
    `;

    db.query(
        getIngredientsSql,
        [userId],
        (err, ingredients) => {

            if (err) {
                return callback(err);
            }

            const deleteOldShoppingListSql = `
                DELETE FROM shopping_lists
                WHERE user_id = ?
            `;

            db.query(
                deleteOldShoppingListSql,
                [userId],
                (err) => {

                    if (err) {
                        return callback(err);
                    }

                    if (
                        ingredients.length === 0
                    ) {
                        return callback(
                            null,
                            []
                        );
                    }

                    let completed = 0;

                    ingredients.forEach(
                        (ingredient) => {

                            const insertSql = `
                                INSERT INTO shopping_lists
                                (
                                    user_id,
                                    item_name,
                                    quantity,
                                    unit,
                                    status
                                )
                                VALUES
                                (?, ?, ?, ?, ?)
                            `;

                            db.query(
                                insertSql,
                                [
                                    userId,
                                    ingredient.ingredient_name,
                                    ingredient.total_quantity,
                                    ingredient.unit,
                                    'Pending'
                                ],
                                (err) => {

                                    if (err) {
                                        return callback(err);
                                    }

                                    completed++;

                                    if (
                                        completed ===
                                        ingredients.length
                                    ) {

                                        callback(
                                            null,
                                            ingredients
                                        );

                                    }

                                }
                            );

                        }
                    );

                }
            );

        }
    );

};

module.exports = {
    generateMonthlyShoppingList
};