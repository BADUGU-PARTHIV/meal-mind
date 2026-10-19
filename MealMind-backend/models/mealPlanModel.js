const db = require('../config/db');

const addMealPlan = (mealData, callback) => {

    const sql = `
        INSERT INTO meal_plans
        (
            user_id,
            meal_type,
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
            meal_date
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(
        sql,
        [
            mealData.user_id,
            mealData.meal_type,
            mealData.recipe_id,
            mealData.food_name,
            mealData.quantity,
            mealData.calories,
            mealData.protein,
            mealData.carbs,
            mealData.fat,
            mealData.fiber,
            mealData.vitamins,
            mealData.minerals,
            mealData.meal_date
        ],
        callback
    );

};

const getMealPlansByUserId = (userId, callback) => {

    const sql = `
        SELECT *
        FROM meal_plans
        WHERE user_id = ?
        ORDER BY meal_date DESC
    `;

    db.query(sql, [userId], callback);

};

const updateMealPlanById = (
    mealId,
    userId,
    mealData,
    callback
) => {

    const sql = `
        UPDATE meal_plans
        SET
            meal_type = ?,
            recipe_id = ?,
            food_name = ?,
            quantity = ?,
            calories = ?,
            protein = ?,
            carbs = ?,
            fat = ?,
            fiber = ?,
            vitamins = ?,
            minerals = ?,
            meal_date = ?
        WHERE id = ?
        AND user_id = ?
    `;

    db.query(
        sql,
        [
            mealData.meal_type,
            mealData.recipe_id,
            mealData.food_name,
            mealData.quantity,
            mealData.calories,
            mealData.protein,
            mealData.carbs,
            mealData.fat,
            mealData.fiber,
            mealData.vitamins,
            mealData.minerals,
            mealData.meal_date,
            mealId,
            userId
        ],
        callback
    );

};

const deleteMealPlanById = (
    mealId,
    userId,
    callback
) => {

    const sql = `
        DELETE FROM meal_plans
        WHERE id = ?
        AND user_id = ?
    `;

    db.query(
        sql,
        [mealId, userId],
        callback
    );

};

module.exports = {
    addMealPlan,
    getMealPlansByUserId,
    updateMealPlanById,
    deleteMealPlanById
};