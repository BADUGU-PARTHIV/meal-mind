const axios = require('axios');

const searchMeal = async (meal) => {

    const response = await axios.get(
        `https://www.themealdb.com/api/json/v1/1/search.php?s=${meal}`
    );

    return response.data;
};

const getRandomMeal = async () => {

    const response = await axios.get(
        'https://www.themealdb.com/api/json/v1/1/random.php'
    );

    return response.data;
};
const getMealsByCategory = async (category) => {

    const response = await axios.get(
        `https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`
    );

    return response.data;
};
const getMealById = async (id) => {

    const response = await axios.get(
        `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`
    );

    return response.data;
};

module.exports = {
    searchMeal,
    getRandomMeal,
    getMealsByCategory,
    getMealById,
};
