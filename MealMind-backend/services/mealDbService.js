const axios = require('axios');
const MEALDB_BASE_URL = 'https://www.themealdb.com/api/json/v1/1';

const searchMeal = async (meal) => {

    const response = await axios.get(
        `${MEALDB_BASE_URL}/search.php`,
        { params: { s: meal } }
    );

    return response.data;
};

const getRandomMeal = async () => {

    const response = await axios.get(
        `${MEALDB_BASE_URL}/random.php`
    );

    return response.data;
};
const getMealsByCategory = async (category) => {

    const response = await axios.get(
        `${MEALDB_BASE_URL}/filter.php`,
        { params: { c: category } }
    );

    return response.data;
};
const getMealById = async (id) => {

    const response = await axios.get(
        `${MEALDB_BASE_URL}/lookup.php`,
        { params: { i: id } }
    );

    return response.data;
};

module.exports = {
    searchMeal,
    getRandomMeal,
    getMealsByCategory,
    getMealById,
};
