const {
    searchRecipes
} = require('../services/mealDbService');

const searchRecipeController = async (req, res) => {

    try {

        const food = req.params.food;

        const data = await searchRecipes(food);

        res.status(200).json(data);

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: 'Spoonacular API Error'
        });

    }

};

module.exports = {
    searchRecipeController
};