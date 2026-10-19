const { searchFood } = require('../services/usdaService');

const searchFoodController = async (req, res) => {

    try {

        const food = req.params.food;

        const data = await searchFood(food);

        res.status(200).json(data);

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: 'USDA API Error'
        });

    }

};

module.exports = {
    searchFoodController
};