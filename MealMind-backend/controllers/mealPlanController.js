const db = require('../config/db');

const {
    getMealPlan
} = require('../services/mealPlanService');
const {
    regenerateRecipe
} = require('../services/regenerateRecipeService');
const getTodayMealPlan =
async (req, res) => {

    try {
        const [users] = await db.promise().query(
            `
            SELECT *
            FROM users
            WHERE id = ?
            `,
            [req.user.id]
        );

        if (users.length === 0) {
            return res.status(404).json({
                message: 'User Not Found'
            });
        }

        const mealPlan = await getMealPlan(users[0]);

        res.json(mealPlan);

    }

    catch (error) {

        console.log(error);

        res.status(500).json({

            message:
            error.message || 'Server Error'

        });

    }

};
const regenerateMealRecipe =
async (req, res) => {

    try {

        const userId =
        req.user.id;

        const {
    meal,
    currentRecipeId,
    excludedRecipeIds
} = req.body;

        db.query(

            `
            SELECT *
            FROM users
            WHERE id = ?
            `,

            [userId],

            async (err, users) => {

                if (err) {

                    return res.status(500).json({

                        message:
                        'Database Error'

                    });

                }

                if (
                    users.length === 0
                ) {

                    return res.status(404).json({

                        message:
                        'User Not Found'

                    });

                }

                const recipe =
await regenerateRecipe(

    users[0],

    meal,

    currentRecipeId,

    excludedRecipeIds

);

                if (!recipe) {

                    return res.status(404).json({

                        message:
                        'No Similar Recipe Found'

                    });

                }

                res.json(recipe);

            }

        );

    }

    catch (error) {

        console.log(error);

        res.status(500).json({

            message:
            'Server Error'

        });

    }

};
module.exports = {
    getTodayMealPlan,
    regenerateMealRecipe
};
