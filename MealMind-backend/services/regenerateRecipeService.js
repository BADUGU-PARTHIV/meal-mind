const db = require('../config/db');

const {
    generateRecommendation
} = require('./recommendationService');

const {
    filterRecipes,
    getRecipeAllergyWarnings
} = require('./recipeFilterService');

const {
    scoreRecipe
} = require('./recipeScoreService');

const query = (

    sql,

    params = []

) => (

    new Promise((resolve, reject) => {

        db.query(sql, params, (err, results) => {

            if (err) {

                return reject(err);

            }

            resolve(results);

        });

    })

);

const getSavedNutrition = async (user) => {

    const [planRows, targetRows] = await Promise.all([

        query(
            `SELECT calories, protein, carbs, fat, fiber
             FROM nutrition_plans
             WHERE user_id = ?
             ORDER BY id DESC
             LIMIT 1`,
            [user.id]
        ),

        query(
            `SELECT calories, protein, carbs, fat, fiber
             FROM nutrition_targets
             WHERE user_id = ?
             LIMIT 1`,
            [user.id]
        )

    ]);

    const savedNutrition =
        planRows[0] ||
        targetRows[0];

    if (savedNutrition) {

        return {
            calories: Number(savedNutrition.calories),
            protein: Number(savedNutrition.protein),
            carbs: Number(savedNutrition.carbs),
            fat: Number(savedNutrition.fat),
            fiber: Number(savedNutrition.fiber)
        };

    }

    const recommendation =
        generateRecommendation(user);

    return {
        calories: Number(recommendation.calories),
        protein: Number(recommendation.protein),
        carbs: Number(recommendation.carbs),
        fat: Number(recommendation.fat ?? recommendation.fats),
        fiber: Number(recommendation.fiber)
    };

};

const regenerateRecipe = async (
    user,
    mealCategory,
    currentRecipeId,
    excludedRecipeIds = []
) => {

    const nutrition =
        await getSavedNutrition(user);

    return new Promise((resolve, reject) => {

        db.query(

            `
            SELECT
                r.*,
                i.name AS ingredient_name
            FROM recipes r
            LEFT JOIN recipe_ingredients ri
                ON r.id = ri.recipe_id
            LEFT JOIN ingredients i
                ON ri.ingredient_id = i.id
            WHERE r.user_id IS NULL
            OR r.user_id = ?
            `,

            [user.id],

            (err, rows) => {

                if (err) {
                    return reject(err);
                }

                const recipeMap = {};
                const recipeIngredients = {};

                rows.forEach(row => {

                    if (!recipeMap[row.id]) {

                        recipeMap[row.id] = {

                            id: row.id,
                            name: row.name,
                            category: row.category,
                            description: row.description,
                            instructions: row.instructions,

                            calories: Number(row.calories),
                            protein: Number(row.protein),
                            carbs: Number(row.carbs),
                            fat: Number(row.fat),
                            fiber: Number(row.fiber),

                            vitamin_a: Number(row.vitamin_a),
                            vitamin_c: Number(row.vitamin_c),
                            vitamin_d: Number(row.vitamin_d),
                            vitamin_b12: Number(row.vitamin_b12),

                            calcium: Number(row.calcium),
                            iron: Number(row.iron),
                            magnesium: Number(row.magnesium),
                            potassium: Number(row.potassium),
                            zinc: Number(row.zinc),

                            image_url: row.image_url
,
                            diet_type: row.diet_type

                        };

                        recipeIngredients[row.id] = [];

                    }

                    if (row.ingredient_name) {

                        recipeIngredients[row.id]
                        .push(row.ingredient_name);

                    }

                });

                let recipes =
                Object.values(recipeMap);

                const dietSafeUser = {
                    ...user,
                    allergy: ''
                };

                const findBestRecipe = (
                    candidateRecipes,
                    allowAllergyWarning = false
                ) => {
                    const filtered =
                        candidateRecipes.filter(recipe =>
                            recipe.category === mealCategory &&
                            !excludedRecipeIds.includes(recipe.id) &&
                            Number(recipe.id) !== Number(currentRecipeId)
                        );

                    const ratio = {

                        Breakfast: 0.25,
                        Lunch: 0.35,
                        Snack: 0.15,
                        Dinner: 0.25

                    };

                    const target = {

                        calories:
                        nutrition.calories *
                        ratio[mealCategory],

                        protein:
                        nutrition.protein *
                        ratio[mealCategory],

                        carbs:
                        nutrition.carbs *
                        ratio[mealCategory],

                        fat:
                        nutrition.fat *
                        ratio[mealCategory],

                        fiber:
                        nutrition.fiber *
                        ratio[mealCategory]

                    };

                    let bestRecipe = null;
                    let bestScore = Infinity;

                    filtered.forEach(recipe => {

                        const score =
                        scoreRecipe(

                            recipe,
                            target,
                            user.deficiency

                        );

                        if (score < bestScore) {

                            bestScore = score;
                            bestRecipe = recipe;

                        }

                    });

                    if (!bestRecipe) {
                        return null;
                    }

                    return {
                        ...bestRecipe,
                        allergy_warnings:
                            allowAllergyWarning
                                ? getRecipeAllergyWarnings(
                                    bestRecipe,
                                    recipeIngredients[bestRecipe.id] || [],
                                    user.allergy
                                )
                                : []
                    };
                };

                const safeRecipes =
                filterRecipes(
                    recipes,
                    recipeIngredients,
                    user
                );

                let bestRecipe =
                    findBestRecipe(
                        safeRecipes
                    );

                if (!bestRecipe) {
                    const dietOnlyRecipes =
                        filterRecipes(
                            recipes,
                            recipeIngredients,
                            dietSafeUser
                        );

                    bestRecipe =
                        findBestRecipe(
                            dietOnlyRecipes,
                            true
                        );
                }

                resolve(bestRecipe);

            }

        );

    });

};

module.exports = {
    regenerateRecipe
};
