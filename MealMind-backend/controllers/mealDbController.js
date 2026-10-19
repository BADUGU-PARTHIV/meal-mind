const {
    searchMeal,
    getMealById
} = require('../services/mealDbService');

const searchMealController = async (req, res) => {

    try {

        const meal = req.params.meal;

        const data = await searchMeal(meal);

        res.status(200).json(data);

    } catch (error) {

        res.status(500).json({
            message: 'MealDB Error'
        });

    }
};

const getMealByIdController = async (req, res) => {

    try {

        const id = req.params.id;

        const data = await getMealById(id);

        res.status(200).json(data);

    } catch (error) {

        res.status(500).json({
            message: 'MealDB Error'
        });

    }
};

module.exports = {
    searchMealController,
    getMealByIdController
};