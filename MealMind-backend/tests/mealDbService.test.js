const test = require('node:test');
const assert = require('node:assert/strict');
const axios = require('axios');
const { searchMeal, getMealById } = require('../services/mealDbService');

test('searchMeal passes the search term as a query parameter', async (context) => {
    const originalGet = axios.get;
    context.after(() => { axios.get = originalGet; });

    axios.get = async (...args) => {
        assert.equal(args[0], 'https://www.themealdb.com/api/json/v1/1/search.php');
        assert.deepEqual(args[1], { params: { s: 'tomato soup' } });
        return { data: { meals: [] } };
    };

    assert.deepEqual(await searchMeal('tomato soup'), { meals: [] });
});

test('getMealById passes the meal id as a query parameter', async (context) => {
    const originalGet = axios.get;
    context.after(() => { axios.get = originalGet; });

    axios.get = async (...args) => {
        assert.equal(args[0], 'https://www.themealdb.com/api/json/v1/1/lookup.php');
        assert.deepEqual(args[1], { params: { i: '52772' } });
        return { data: { meals: [{ idMeal: '52772' }] } };
    };

    assert.deepEqual(await getMealById('52772'), { meals: [{ idMeal: '52772' }] });
});
