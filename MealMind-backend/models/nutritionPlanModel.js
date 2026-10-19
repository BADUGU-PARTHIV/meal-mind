const db = require('../config/db');

const saveNutritionPlan = (
userId,
nutrition,
callback
) => {


console.log(
    "saveNutritionPlan called",
    userId
);

db.query(

    'DELETE FROM nutrition_plans WHERE user_id = ?',

    [userId],

    (deleteErr) => {

        if (deleteErr) {

            return callback(deleteErr);

        }

        const sql = `
            INSERT INTO nutrition_plans
            (
                user_id,
                calories,
                protein,
                carbs,
                fat,
                fiber,
                vitamin_a,
                vitamin_c,
                vitamin_d,
                vitamin_b12,
                calcium,
                iron,
                magnesium,
                potassium,
                zinc
            )
            VALUES
            (
                ?,?,?,?,?,?,
                ?,?,?,?,
                ?,?,?,?,?
            )
        `;

        db.query(
            sql,
            [
                userId,

                nutrition.calories,
                nutrition.protein,
                nutrition.carbs,
                nutrition.fat,
                nutrition.fiber,

                nutrition.vitaminA,
                nutrition.vitaminC,
                nutrition.vitaminD,
                nutrition.vitaminB12,

                nutrition.calcium,
                nutrition.iron,
                nutrition.magnesium,
                nutrition.potassium,
                nutrition.zinc
            ],
            callback
        );

    }

);


};

const getNutritionPlan = (
userId,
callback
) => {


db.query(

    `
    SELECT *
    FROM nutrition_plans
    WHERE user_id = ?
    ORDER BY id DESC
    LIMIT 1
    `,

    [userId],

    callback

);


};

const updateNutritionPlan = (
userId,
data,
callback
) => {


const sql = `
    UPDATE nutrition_plans
    SET
        calories = ?,
        protein = ?,
        carbs = ?,
        fat = ?,
        fiber = ?
    WHERE user_id = ?
`;

db.query(
    sql,
    [
        data.calories,
        data.protein,
        data.carbs,
        data.fat,
        data.fiber,
        userId
    ],
    (err, result) => {

        if (err) {

            return callback(err);

        }

        if (result.affectedRows > 0) {

            return callback(null, result);

        }

        const insertSql = `
            INSERT INTO nutrition_plans
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
        `;

        db.query(
            insertSql,
            [
                userId,
                data.calories,
                data.protein,
                data.carbs,
                data.fat,
                data.fiber
            ],
            callback
        );

    }
);


};

module.exports = {
saveNutritionPlan,
getNutritionPlan,
updateNutritionPlan
};

