const { getMealById } = require('./mealDbService');
const { getFoodNutrition } = require('./usdaService');
const { getCatalogRecipeById } = require('./recipeCatalog');

const getFullRecipeDetails = async (mealId) => {

    const catalogRecipe = getCatalogRecipeById(mealId);

    if (catalogRecipe) {
        return {
            ...catalogRecipe,
            image: null,
            vitamins: [],
            minerals: []
        };
    }

    const mealData = await getMealById(mealId);

    if (
        !mealData.meals ||
        mealData.meals.length === 0
    ) {
        throw new Error('Recipe Not Found');
    }

    const meal = mealData.meals[0];

    const ingredients = [];

    let totalCalories = 0;
    let totalProtein = 0;
    let totalCarbs = 0;
    let totalFat = 0;
    let totalFiber = 0;

    const vitamins = new Set();
    const minerals = new Set();

    for (let i = 1; i <= 20; i++) {

        const ingredient =
            meal[`strIngredient${i}`];

        const measure =
            meal[`strMeasure${i}`];

        if (
            ingredient &&
            ingredient.trim() !== ''
        ) {

            ingredients.push({
                name: ingredient,
                measure
            });

            try {

                const nutrition =
                    await getFoodNutrition(
                        ingredient
                    );

                if (
                    nutrition &&
                    nutrition.foodNutrients
                ) {

                    nutrition.foodNutrients.forEach(
                        nutrient => {

                            switch (
                                nutrient.nutrientName
                            ) {

                                case 'Energy':
                                    totalCalories +=
                                        nutrient.value || 0;
                                    break;

                                case 'Protein':
                                    totalProtein +=
                                        nutrient.value || 0;
                                    break;

                                case 'Carbohydrate, by difference':
                                    totalCarbs +=
                                        nutrient.value || 0;
                                    break;

                                case 'Total lipid (fat)':
                                    totalFat +=
                                        nutrient.value || 0;
                                    break;

                                case 'Fiber, total dietary':
                                    totalFiber +=
                                        nutrient.value || 0;
                                    break;
                            }

                            if (
                                nutrient.nutrientName
                                    .includes('Vitamin')
                            ) {
                                vitamins.add(
                                    nutrient.nutrientName
                                );
                            }

                            if (
                                [
                                    'Iron',
                                    'Potassium',
                                    'Magnesium',
                                    'Zinc',
                                    'Calcium',
                                    'Phosphorus'
                                ].includes(
                                    nutrient.nutrientName
                                )
                            ) {
                                minerals.add(
                                    nutrient.nutrientName
                                );
                            }

                        }
                    );

                }

            } catch (error) {

                console.log(
                    `Nutrition Missing For ${ingredient}`
                );

            }

        }

    }

    return {

        id: meal.idMeal,

        name: meal.strMeal,

        image: meal.strMealThumb,

        category: meal.strCategory,

        area: meal.strArea,

        instructions:
            meal.strInstructions,

        ingredients,

        nutrition: {

            calories:
                Math.round(totalCalories),

            protein:
                Math.round(totalProtein),

            carbs:
                Math.round(totalCarbs),

            fat:
                Math.round(totalFat),

            fiber:
                Math.round(totalFiber)

        },

        vitamins:
            [...vitamins],

        minerals:
            [...minerals]

    };

};

module.exports = {
    getFullRecipeDetails
};
