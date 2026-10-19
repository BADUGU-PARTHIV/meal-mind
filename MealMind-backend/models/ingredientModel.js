const db = require('../config/db');

const getIngredientsByMealId = (mealId, callback) => {

    const sql = `
        SELECT *
        FROM meal_ingredient_usage
        WHERE meal_plan_id = ?
    `;

    db.query(sql, [mealId], callback);

};

const consumeIngredient = (id, callback) => {

    const sql = `
        UPDATE meal_ingredient_usage
        SET
            status = 'Consumed',
            consumed_at = NOW()
        WHERE id = ?
    `;

    db.query(sql, [id], callback);

};

module.exports = {
    getIngredientsByMealId,
    consumeIngredient
};