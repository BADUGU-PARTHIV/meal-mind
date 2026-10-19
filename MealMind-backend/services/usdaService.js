const axios = require('axios');
require('dotenv').config({ quiet: true });

const USDA_API_KEY = process.env.USDA_API_KEY;

const requireApiKey = () => {
    if (!USDA_API_KEY) {
        throw new Error('USDA_API_KEY is not configured');
    }
    return USDA_API_KEY;
};

const searchFood = async (food) => {

    const response = await axios.get(
        'https://api.nal.usda.gov/fdc/v1/foods/search',
        {
            params: {
                api_key: requireApiKey(),
                query: food
            }
        }
    );

    return response.data;

};
const getFoodNutrition = async (foodName) => {

    const response = await axios.get(
        'https://api.nal.usda.gov/fdc/v1/foods/search',
        {
            params: {
                api_key: requireApiKey(),
                query: foodName,
                pageSize: 1
            }
        }
    );

    return response.data.foods?.[0] ?? null;
};
module.exports = {
    searchFood,
    getFoodNutrition
};
