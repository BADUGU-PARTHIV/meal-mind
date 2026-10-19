const axios = require('axios');

const USDA_API_KEY = 'uujILLCbKEE1OLE2P0TbBMQowFZlTWJ3dO0IYUkh';

const searchFood = async (food) => {

    const response = await axios.get(
        'https://api.nal.usda.gov/fdc/v1/foods/search',
        {
            params: {
                api_key: USDA_API_KEY,
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
                api_key: USDA_API_KEY,
                query: foodName,
                pageSize: 1
            }
        }
    );

    return response.data.foods[0];
};
module.exports = {
    searchFood,
    getFoodNutrition
};