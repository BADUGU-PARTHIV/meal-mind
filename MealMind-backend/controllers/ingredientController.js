const db = require('../config/db');
const {
    getIngredientsByMealId,
    consumeIngredient
} = require('../models/ingredientModel');
const {
    reducePantryQuantity
} = require('../models/pantryModel');

const getMealIngredients = (req, res) => {

    getIngredientsByMealId(
        req.params.mealId,
        (err, results) => {

            if (err) {
                return res.status(500).json({
                    message: 'Database Error'
                });
            }

            res.status(200).json(results);

        }
    );

};

const markIngredientConsumed = (req, res) => {

    const ingredientId = req.params.id;

    consumeIngredient(
        ingredientId,
        (err, result) => {

            if (err) {
                return res.status(500).json({
                    message: 'Failed'
                });
            }

            const sql = `
                SELECT *
                FROM meal_ingredient_usage
                WHERE id = ?
            `;

            db.query(
                sql,
                [ingredientId],
                (err, ingredient) => {

                    if (err) {
                        return res.status(500).json({
                            message: 'Error'
                        });
                    }

                    const item =
                        ingredient[0];

                    reducePantryQuantity(
                        req.user.id,
                        item.ingredient_name,
                        item.quantity,
                        (err) => {

                            if (err) {
                                return res.status(500).json({
                                    message: 'Pantry Update Failed'
                                });
                            }

                            res.json({
                                message:
                                    'Ingredient Consumed & Pantry Updated'
                            });

                        }
                    );

                }
            );

        }
    );

};

module.exports = {
    getMealIngredients,
    markIngredientConsumed
};