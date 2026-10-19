const db = require('../config/db');

const buildDashboard = (userId) => {

    return new Promise((resolve, reject) => {

        const sql = `
            SELECT
                IFNULL(SUM(fl.calories),0) AS totalCalories,
                IFNULL(SUM(fl.protein),0) AS totalProtein,
                IFNULL(SUM(fl.carbs),0) AS totalCarbs,
                IFNULL(SUM(fl.fat),0) AS totalFat,
                IFNULL(SUM(fl.fiber),0) AS totalFiber,

                (
                    SELECT IFNULL(SUM(amount),0)
                    FROM water_logs
                    WHERE user_id=?
                    AND DATE(created_at)=CURDATE()
                ) AS waterIntake,

                (
                    SELECT COUNT(*)
                    FROM meal_plans
                    WHERE user_id=?
                ) AS mealCount,

                (
                    SELECT COUNT(*)
                    FROM pantry_items
                    WHERE user_id=?
                ) AS pantryCount,

                (
                    SELECT COUNT(*)
                    FROM shopping_lists
                    WHERE user_id=?
                ) AS shoppingCount

            FROM food_logs fl

            WHERE fl.user_id=?
            AND DATE(fl.consumed_date)=CURDATE()
        `;

        db.query(

            sql,

            [

                userId,
                userId,
                userId,
                userId,
                userId

            ],

            (err, dashboardResult) => {

                if (err) {

                    return reject(err);

                }

                const dashboard =
                dashboardResult[0];

                db.query(

                    `
                    SELECT *
                    FROM nutrition_plans
                    WHERE user_id=?
                    ORDER BY id DESC
                    LIMIT 1
                    `,

                    [userId],

                    (err, nutritionResult) => {

                        if (err) {

                            return reject(err);

                        }

                        const nutrition =
                        nutritionResult[0] || {};

                        dashboard.goalCalories =
                        nutrition.calories || 0;

                        dashboard.goalProtein =
                        nutrition.protein || 0;

                        dashboard.goalCarbs =
                        nutrition.carbs || 0;

                        dashboard.goalFat =
                        nutrition.fat || 0;

                        dashboard.goalFiber =
                        nutrition.fiber || 0;

                        dashboard.goalWater = 3.5;

                        dashboard.calorieProgress =
                        dashboard.goalCalories
                        ? Math.min(
                            100,
                            Math.round(
                                dashboard.totalCalories /
                                dashboard.goalCalories * 100
                            )
                        )
                        : 0;

                        dashboard.proteinProgress =
                        dashboard.goalProtein
                        ? Math.min(
                            100,
                            Math.round(
                                dashboard.totalProtein /
                                dashboard.goalProtein * 100
                            )
                        )
                        : 0;

                        dashboard.carbProgress =
                        dashboard.goalCarbs
                        ? Math.min(
                            100,
                            Math.round(
                                dashboard.totalCarbs /
                                dashboard.goalCarbs * 100
                            )
                        )
                        : 0;

                        dashboard.fatProgress =
                        dashboard.goalFat
                        ? Math.min(
                            100,
                            Math.round(
                                dashboard.totalFat /
                                dashboard.goalFat * 100
                            )
                        )
                        : 0;

                        dashboard.fiberProgress =
                        dashboard.goalFiber
                        ? Math.min(
                            100,
                            Math.round(
                                dashboard.totalFiber /
                                dashboard.goalFiber * 100
                            )
                        )
                        : 0;

                        dashboard.waterProgress =
                        Math.min(
                            100,
                            Math.round(
                                dashboard.waterIntake /
                                dashboard.goalWater * 100
                            )
                        );

                        dashboard.healthScore =
                        Math.round(

                            (
                                dashboard.calorieProgress +

                                dashboard.proteinProgress +

                                dashboard.waterProgress +

                                dashboard.carbProgress +

                                dashboard.fatProgress +

                                dashboard.fiberProgress

                            ) / 6

                        );

                        dashboard.insights = [];

                        if (
                            dashboard.totalCalories <
                            dashboard.goalCalories
                        ) {

                            dashboard.insights.push(

                                `🔥 ${
                                    dashboard.goalCalories -
                                    dashboard.totalCalories
                                } kcal remaining today`

                            );

                        }

                        if (
                            dashboard.totalProtein <
                            dashboard.goalProtein
                        ) {

                            dashboard.insights.push(

                                `💪 ${
                                    dashboard.goalProtein -
                                    dashboard.totalProtein
                                } g protein remaining`

                            );

                        }

                        if (
                            dashboard.waterIntake <
                            dashboard.goalWater
                        ) {

                            dashboard.insights.push(

                                `💧 ${(
                                    dashboard.goalWater -
                                    dashboard.waterIntake
                                ).toFixed(1)} L water remaining`

                            );

                        }

                        if (
                            dashboard.shoppingCount > 0
                        ) {

                            dashboard.insights.push(

                                `🛒 ${dashboard.shoppingCount} shopping items pending`

                            );

                        }

                        if (
                            dashboard.pantryCount < 5
                        ) {

                            dashboard.insights.push(

                                "⚠️ Pantry is running low"

                            );

                        }

                        resolve(dashboard);

                    }

                );

            }

        );

    });

};

module.exports = {

    buildDashboard

};