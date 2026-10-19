const allergyMap = {
    Milk: [
        'Milk',
        'Paneer',
        'Cheese',
        'Curd',
        'Butter',
        'Ghee',
        'Greek Yogurt',
        'Yogurt'
    ],
    Egg: ['Egg'],
    Fish: ['Fish'],
    Peanut: ['Peanut']
};

const nonVegIngredients = [
    'Chicken Breast',
    'Chicken Thigh',
    'Duck Meat',
    'Egg',
    'Fish',
    'Prawns',
    'Mutton',
    'Meat'
];

const dairyIngredients = [
    'Milk',
    'Paneer',
    'Cheese',
    'Curd',
    'Butter',
    'Ghee',
    'Greek Yogurt',
    'Yogurt'
];

const normalizeText = value =>
    String(value || '')
        .trim()
        .toLowerCase();

const normalizeDiet = diet =>
    normalizeText(diet)
        .replace(/-/g, ' ');

const splitAllergies = allergy =>
    String(allergy || '')
        .split(',')
        .map(item => item.trim())
        .filter(Boolean);

const ingredientMatches = (
    ingredient,
    target
) => {
    const ingredientText =
        normalizeText(ingredient);
    const targetText =
        normalizeText(target);

    return Boolean(
        ingredientText &&
        targetText &&
        (
            ingredientText === targetText ||
            ingredientText.includes(targetText) ||
            targetText.includes(ingredientText)
        )
    );
};

const getAllergyIngredients = allergy =>
    splitAllergies(allergy)
        .flatMap(item => {
            const mapKey =
                Object.keys(allergyMap)
                    .find(key =>
                        normalizeText(key) ===
                        normalizeText(item)
                    );

            return mapKey
                ? allergyMap[mapKey]
                : [item];
        });

const isNonVegRecipe = (
    recipe,
    ingredients = []
) => {
    const recipeDiet =
        normalizeDiet(recipe.diet_type);

    return (
        recipeDiet === 'non veg' ||
        ingredients.some(ingredient =>
            nonVegIngredients.some(nonVeg =>
                ingredientMatches(
                    ingredient,
                    nonVeg
                )
            )
        )
    );
};

const isVeganRecipe = (
    recipe,
    ingredients = []
) => {
    const recipeDiet =
        normalizeDiet(recipe.diet_type);

    if (recipeDiet === 'vegan') {
        return true;
    }

    if (isNonVegRecipe(recipe, ingredients)) {
        return false;
    }

    return !ingredients.some(ingredient =>
        dairyIngredients.some(dairy =>
            ingredientMatches(
                ingredient,
                dairy
            )
        )
    );
};

const classifyRecipeDiet = (
    recipe,
    ingredients = []
) => {
    const recipeDiet =
        normalizeDiet(recipe.diet_type);

    if (recipeDiet === 'vegan') {
        return 'Vegan';
    }

    if (
        recipeDiet === 'veg' ||
        recipeDiet === 'vegetarian'
    ) {
        return 'Veg';
    }

    if (recipeDiet === 'non veg') {
        return 'Non-Veg';
    }

    if (isNonVegRecipe(recipe, ingredients)) {
        return 'Non-Veg';
    }

    if (isVeganRecipe(recipe, ingredients)) {
        return 'Vegan';
    }

    return 'Veg';
};

const getRecipeAllergyWarnings = (
    recipe,
    ingredients = [],
    allergy
) => {
    const allergyIngredients =
        getAllergyIngredients(allergy);

    if (!allergyIngredients.length) {
        return [];
    }

    const matched =
        ingredients.filter(ingredient =>
            allergyIngredients.some(allergyIngredient =>
                ingredientMatches(
                    ingredient,
                    allergyIngredient
                )
            )
        );

    return [...new Set(matched)];
};

const filterRecipes = (
    recipes,
    recipeIngredients,
    user = {}
) => {
    const userDiet =
        normalizeDiet(user.diet_type);

    let filteredRecipes =
        [...recipes];

    if (
        userDiet === 'veg' ||
        userDiet === 'vegetarian'
    ) {
        filteredRecipes =
            filteredRecipes.filter(recipe =>
                !isNonVegRecipe(
                    recipe,
                    recipeIngredients[recipe.id] || []
                )
            );
    }

    if (userDiet === 'vegan') {
        filteredRecipes =
            filteredRecipes.filter(recipe =>
                isVeganRecipe(
                    recipe,
                    recipeIngredients[recipe.id] || []
                )
            );
    }

    if (user.allergy) {
        filteredRecipes =
            filteredRecipes.filter(recipe =>
                getRecipeAllergyWarnings(
                    recipe,
                    recipeIngredients[recipe.id] || [],
                    user.allergy
                ).length === 0
            );
    }

    return filteredRecipes;
};

module.exports = {
    filterRecipes,
    classifyRecipeDiet,
    getRecipeAllergyWarnings,
    isNonVegRecipe,
    isVeganRecipe
};
