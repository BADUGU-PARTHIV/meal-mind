const db = require("../config/db");

const addCustomMeal = (foodData) => {

    return new Promise((resolve, reject) => {

        let foodName = foodData.food_name
            .trim()
            .toLowerCase();

        if (foodName.endsWith("s")) {

            foodName = foodName.slice(0, -1);

        }

        const ingredientSql = `
            SELECT *
            FROM ingredients
            WHERE
                LOWER(name) LIKE CONCAT('%', ?, '%')
                OR ? LIKE CONCAT('%', LOWER(name), '%')
            LIMIT 1
        `;

        db.query(

            ingredientSql,

            [

                foodName,

                foodName

            ],

            (err, result) => {

                if (err) {

                    return reject(err);

                }

                if (result.length === 0) {

                    return reject(

                        new Error(

                            `${foodData.food_name} not found`

                        )

                    );

                }

                const ingredient = result[0];

                const factor =
                    Number(foodData.quantity) / 100;

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
                        consumed_date
                    )
                    VALUES
                    (
                        ?,?,?,?,?,?,?,?,?,?,?
                    )
                `;

                db.query(

                    sql,

                    [

                        foodData.user_id,

                        ingredient.name,

                        foodData.quantity,

                        Number(ingredient.calories_100g) * factor,

                        Number(ingredient.protein_100g) * factor,

                        Number(ingredient.carbs_100g) * factor,

                        Number(ingredient.fat_100g) * factor,

                        Number(ingredient.fiber_100g) * factor,

                        "",

                        "",

                        foodData.consumed_date

                    ],

                    (insertErr, insertResult) => {

                        if (insertErr) {

                            return reject(insertErr);

                        }

                        resolve({
                            id: insertResult.insertId,
                            food_name: ingredient.name,
                            quantity: foodData.quantity,
                            calories:
                                Number(ingredient.calories_100g) * factor,
                            protein:
                                Number(ingredient.protein_100g) * factor,
                            carbs:
                                Number(ingredient.carbs_100g) * factor,
                            fat:
                                Number(ingredient.fat_100g) * factor,
                            fiber:
                                Number(ingredient.fiber_100g) * factor
                        });

                    }

                );

            }

        );

    });

};

module.exports = {

    addCustomMeal

};
