const db = require("../config/db");

const getNutritionTarget = (userId, callback) => {

    const sql = `
        SELECT *
        FROM nutrition_targets
        WHERE user_id = ?
    `;

    db.query(

        sql,

        [userId],

        callback

    );

};

const saveNutritionTarget = (

    data,

    callback

) => {

    const sql = `
        INSERT INTO nutrition_targets
        (
            user_id,
            calories,
            protein,
            carbs,
            fat,
            fiber
        )
        VALUES
        (
            ?,?,?,?,?,?
        )

        ON DUPLICATE KEY UPDATE

        calories = VALUES(calories),

        protein = VALUES(protein),

        carbs = VALUES(carbs),

        fat = VALUES(fat),

        fiber = VALUES(fiber)
    `;

    db.query(

        sql,

        [

            data.user_id,

            data.calories,

            data.protein,

            data.carbs,

            data.fat,

            data.fiber

        ],

        callback

    );

};

module.exports = {

    getNutritionTarget,

    saveNutritionTarget

};