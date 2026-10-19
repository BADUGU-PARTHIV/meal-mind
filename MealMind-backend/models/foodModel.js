const db = require('../config/db');

const addFood = (foodData, callback) => {

    const sql = `
        INSERT INTO food_logs
        (
            user_id,
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
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(sql, [
        foodData.user_id,
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
    ], callback);

};
const getFoodsByUserId = (userId, callback) => {

    const sql = `
        SELECT * FROM food_logs
        WHERE user_id = ?
        ORDER BY consumed_date DESC
    `;

    db.query(sql, [userId], callback);

};
const updateFoodById = (foodId, userId, foodData, callback) => {

    const sql = `
        UPDATE food_logs
        SET
            food_name = ?,
            quantity = ?,
            calories = ?,
            protein = ?,
            carbs = ?,
            fat = ?,
            fiber = ?,
            vitamins = ?,
            minerals = ?,
            consumed_date = ?
        WHERE id = ? AND user_id = ?
    `;

    db.query(sql, [
        foodData.food_name,
        foodData.quantity,
        foodData.calories,
        foodData.protein,
        foodData.carbs,
        foodData.fat,
        foodData.fiber,
        foodData.vitamins,
        foodData.minerals,
        foodData.consumed_date,
        foodId,
        userId
    ], callback);

};

const deleteFoodById = (foodId, userId, callback) => {

    const sql = `
        DELETE FROM food_logs
        WHERE id = ? AND user_id = ?
    `;

    db.query(sql, [foodId, userId], callback);

};
const deleteTodayFoodsByUserId = (userId, callback) => {

    db.beginTransaction((transactionError) => {

        if (transactionError) return callback(transactionError);

        db.query(
            `UPDATE pantry_items p
             JOIN (
                SELECT
                    fl.user_id,
                    LOWER(TRIM(i.name)) AS item_name,
                    SUM(
                        ri.quantity_g * IFNULL(fl.quantity, 1)
                    ) AS total_grams
                FROM food_logs fl
                JOIN recipe_ingredients ri
                    ON ri.recipe_id = fl.recipe_id
                JOIN ingredients i
                    ON i.id = ri.ingredient_id
                WHERE fl.user_id = ?
                AND DATE(fl.consumed_date) = CURDATE()
                AND fl.recipe_id IS NOT NULL
                GROUP BY fl.user_id, LOWER(TRIM(i.name))
             ) restored
                ON restored.user_id = p.user_id
                AND restored.item_name = LOWER(TRIM(p.item_name))
             SET p.quantity = p.quantity +
                CASE
                    WHEN p.unit = 'kg'
                        THEN restored.total_grams / 1000
                    WHEN p.unit = 'g'
                        THEN restored.total_grams
                    ELSE 0
                END`,
            [userId],
            (restoreError) => {

                if (restoreError) {
                    return db.rollback(() => callback(restoreError));
                }

                db.query(
                    `DELETE FROM food_logs
                     WHERE user_id = ?
                     AND DATE(consumed_date) = CURDATE()`,
                    [userId],
                    (deleteError, result) => {

                        if (deleteError) {
                            return db.rollback(() => callback(deleteError));
                        }

                        db.commit((commitError) => {
                            if (commitError) {
                                return db.rollback(() => callback(commitError));
                            }
                            callback(null, result);
                        });

                    }
                );

            }
        );

    });

};
module.exports = {
    addFood,
    getFoodsByUserId,
    updateFoodById,
    deleteFoodById,
    deleteTodayFoodsByUserId
};
