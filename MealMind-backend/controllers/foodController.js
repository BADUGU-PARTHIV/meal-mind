const {
    completeMeal,
    uncompleteMeal
} = require('../services/mealCompletionService');
const {
    addFood,
    getFoodsByUserId,
    updateFoodById,
    deleteFoodById,
    deleteTodayFoodsByUserId
} = require('../models/foodModel');
const {
    checkRecipeIngredients
} = require('../services/pantryRecipeService');
const createFood = async (req, res) => {

    try {

        const foodData = {

            user_id: req.user.id,

            recipe_id: req.body.recipe_id,

            food_name: req.body.food_name,

            quantity: req.body.quantity,

            calories: req.body.calories,

            protein: req.body.protein,

            carbs: req.body.carbs,

            fat: req.body.fat,

            fiber: req.body.fiber,

            vitamins: req.body.vitamins,

            minerals: req.body.minerals,

            meal_context:
                req.body.meal_context ||
                req.body.mealContext ||
                'extra',

            consumed_date:
                req.body.consumed_date ||
                new Date().toISOString().split('T')[0]

        };

        if (foodData.recipe_id) {
            const pantryStatus = await checkRecipeIngredients(
                req.user.id,
                foodData.recipe_id,
                foodData.quantity
            );

            if (pantryStatus.missing.length > 0) {
                return res.status(400).json({
                    message:
                        'Add the missing recipe ingredients to your pantry before completing this meal.',
                    missing: pantryStatus.missing
                });
            }
        }

        const foodLogId = await completeMeal(foodData);

        res.status(201).json({

            message:
            'Meal Completed Successfully',

            food_log_id: foodLogId

        });

    }

    catch (error) {

        console.log(error);

        res.status(500).json({

            message:
            'Failed To Complete Meal'

        });

    }

};
const undoCompletedMeal = async (req, res) => {

    try {

        await uncompleteMeal(
            req.params.id,
            req.user.id,
            req.query.recipe_id,
            req.query.serving_multiplier
        );

        res.json({
            message: 'Meal Marked As Not Complete'
        });

    }

    catch (error) {

        console.log(error);

        res.status(400).json({
            message:
                error.message ||
                'Failed To Undo Completed Meal'
        });

    }

};
const getFoods = (req, res) => {

    getFoodsByUserId(req.user.id, (err, results) => {

        if (err) {
            return res.status(500).json({
                message: 'Database Error'
            });
        }

        res.status(200).json(results);

    });

};
const updateFood = (req, res) => {

    updateFoodById(
        req.params.id,
        req.user.id,
        req.body,
        (err, result) => {

            if (err) {
                return res.status(500).json({
                    message: 'Update Failed'
                });
            }

            res.json({
                message: 'Food Updated Successfully'
            });

        }
    );

};

const deleteFood = (req, res) => {

    deleteFoodById(
        req.params.id,
        req.user.id,
        (err, result) => {

            if (err) {
                return res.status(500).json({
                    message: 'Delete Failed'
                });
            }

            res.json({
                message: 'Food Deleted Successfully'
            });

        }
    );

};
const resetTodayFoods = (req, res) => {

    deleteTodayFoodsByUserId(
        req.user.id,
        (err, result) => {

            if (err) {
                return res.status(500).json({
                    message: 'Unable To Reset Today Meals'
                });
            }

            res.json({
                message: 'Today Meals Reset Successfully',
                deleted_count: result.affectedRows
            });

        }
    );

};
module.exports = {
    createFood,
    undoCompletedMeal,
    getFoods,
    updateFood,
    deleteFood,
    resetTodayFoods
};
