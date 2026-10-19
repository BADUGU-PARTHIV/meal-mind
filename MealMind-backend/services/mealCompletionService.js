const db = require('../config/db');

const completeMeal = (foodData) => {

    return new Promise((resolve, reject) => {

        db.query(

            `
            INSERT INTO food_logs
            (
                user_id,
                recipe_id,
                food_name,
                quantity,
                calories,
                protein,
                carbs,
                fat,
                fiber,
                vitamins,
                minerals,
                meal_context,
                consumed_date
            )
            VALUES
            (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `,

            [

                foodData.user_id,
                foodData.recipe_id || null,
                foodData.food_name,
                foodData.quantity,
                foodData.calories,
                foodData.protein,
                foodData.carbs,
                foodData.fat,
                foodData.fiber,
                foodData.vitamins,
                foodData.minerals,
                foodData.meal_context || 'extra',
                foodData.consumed_date

            ],

            (err, insertResult) => {

                if (err) {

                    return reject(err);

                }

                db.query(

                    `
                    SELECT
                        i.name,
                        ri.quantity_g
                    FROM recipe_ingredients ri
                    JOIN ingredients i
                    ON ri.ingredient_id = i.id
                    WHERE ri.recipe_id = ?
                    `,

                    [

                        foodData.recipe_id

                    ],

                    (err, ingredients) => {

                        if (err) {

                            return reject(err);

                        }

                        if (ingredients.length === 0) {

                            return resolve(insertResult.insertId);

                        }

                        let completed = 0;

                        ingredients.forEach(item => {

                            db.query(

                                `
                                UPDATE pantry_items
                                SET quantity = GREATEST(
                                    0,
                                    quantity -
                                    CASE
                                        WHEN unit = 'kg' THEN ? / 1000
                                        ELSE ?
                                    END
                                )
                                WHERE user_id = ?
                                AND LOWER(TRIM(item_name)) =
                                    LOWER(TRIM(?))
                                AND unit IN ('g', 'kg')
                                `,

                                [

                                    item.quantity_g *
                                        Number(foodData.quantity || 1),
                                    item.quantity_g *
                                        Number(foodData.quantity || 1),
                                    foodData.user_id,
                                    item.name

                                ],

                                (err) => {

                                    if (err) {

                                        return reject(err);

                                    }

                                    db.query(

                                        `
                                        SELECT
                                            quantity,
                                            low_stock_threshold,
                                            unit
                                        FROM pantry_items
                                        WHERE user_id = ?
                                        AND item_name = ?
                                        `,

                                        [

                                            foodData.user_id,
                                            item.name

                                        ],

                                        (err, pantry) => {

                                            if (err) {

                                                return reject(err);

                                            }

                                            if (

                                                pantry.length > 0 &&

                                                Number(pantry[0].quantity) <=
                                                Number(pantry[0].low_stock_threshold)

                                            ) {

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
                                                    VALUES
                                                    (?, ?, ?, ?, 'Pending')
                                                    ON DUPLICATE KEY UPDATE
                                                    quantity = VALUES(quantity)
                                                    `,

                                                    [

                                                        foodData.user_id,

                                                        item.name,

                                                        Number(
                                                            pantry[0].low_stock_threshold
                                                        ) * 5,

                                                        pantry[0].unit

                                                    ],

                                                    () => {}

                                                );

                                            }

                                            completed++;

                                            if (

                                                completed ===
                                                ingredients.length

                                            ) {

                                                resolve(insertResult.insertId);

                                            }

                                        }

                                    );

                                }

                            );

                        });

                    }

                );

            }

        );

    });

};

const uncompleteMeal = (
    foodLogId,
    userId,
    recipeId,
    servingMultiplier = 1
) => {

    return new Promise((resolve, reject) => {

        db.query(
            `DELETE FROM food_logs
             WHERE id = ? AND user_id = ?`,
            [foodLogId, userId],
            (deleteErr, deleteResult) => {

                if (deleteErr) return reject(deleteErr);

                if (deleteResult.affectedRows === 0) {
                    return reject(new Error('Completed meal not found'));
                }

                if (!recipeId) return resolve();

                db.query(
                    `SELECT i.name, ri.quantity_g
                     FROM recipe_ingredients ri
                     JOIN ingredients i
                     ON ri.ingredient_id = i.id
                     WHERE ri.recipe_id = ?`,
                    [recipeId],
                    (ingredientErr, ingredients) => {

                        if (ingredientErr) return reject(ingredientErr);
                        if (ingredients.length === 0) return resolve();

                        let restored = 0;

                        ingredients.forEach(item => {
                            db.query(
                                `UPDATE pantry_items
                                 SET quantity = quantity +
                                    CASE
                                        WHEN unit = 'kg' THEN ? / 1000
                                        ELSE ?
                                    END
                                 WHERE user_id = ?
                                 AND LOWER(TRIM(item_name)) =
                                    LOWER(TRIM(?))
                                 AND unit IN ('g', 'kg')`,
                                [
                                    item.quantity_g *
                                        Number(servingMultiplier || 1),
                                    item.quantity_g *
                                        Number(servingMultiplier || 1),
                                    userId,
                                    item.name
                                ],
                                (restoreErr) => {

                                    if (restoreErr) return reject(restoreErr);

                                    restored++;

                                    if (restored === ingredients.length) {
                                        resolve();
                                    }

                                }
                            );
                        });

                    }
                );

            }
        );

    });

};

module.exports = {

    completeMeal,
    uncompleteMeal

};
