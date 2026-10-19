const db = require("../config/db");

const {

    generateRecommendation

} = require("./recommendationService");

const {

    filterRecipes,
    getRecipeAllergyWarnings

} = require("./recipeFilterService");

const nutrients = [

    "calories",

    "protein",

    "carbs",

    "fat",

    "fiber"

];

const mealRatios = {

    Breakfast: 0.25,

    Lunch: 0.35,

    Snack: 0.15,

    Dinner: 0.25

};

const query = (

    sql,

    params = []

) => (

    new Promise(

        (

            resolve,

            reject

        ) => {

            db.query(

                sql,

                params,

                (

                    error,

                    results

                ) => {

                    if (error)

                        return reject(

                            error

                        );

                    resolve(

                        results

                    );

                }

            );

        }

    )

);

const clamp = (

    value,

    minimum,

    maximum

) =>

Math.min(

maximum,

Math.max(

minimum,

value

)

);

const round = value =>

Math.round(

value * 10

) / 10;

const roundServing = value =>

Math.round(

value * 100

) / 100;

const scaleRecipe = (

    recipe,

    multiplier

) => {

    const serving =

        roundServing(

            multiplier

        );

    const scaled = {

        ...recipe,

        serving_multiplier:

            serving,

        base_nutrition: {}

    };

    nutrients.forEach(

        key => {

            scaled.base_nutrition[key] =

                Number(

                    recipe[key]

                );

            scaled[key] =

                round(

                    Number(

                        recipe[key]

                    ) *

                    serving

                );

        }

    );

    return scaled;

};

const sumPlan = recipes => {

    const totals = {};

    nutrients.forEach(

        key => {

            totals[key] =

                round(

                    recipes.reduce(

                        (

                            sum,

                            recipe

                        ) =>

                            sum +

                            Number(

                                recipe[key]

                            ),

                        0

                    )

                );

        }

    );

    return totals;

};

const scorePlan = (

    totals,

    targets

) => {

    const weights = {

        calories: 2,

        protein: 1000,

        carbs: 200,

        fat: 20,

        fiber: 20

    };

    let score = 0;

    nutrients.forEach(

        key => {

            const target =

                Number(

                    targets[key]

                );

            if (

                !target

            ) return;

            const diff =

                (
                    totals[key] -

                    target
                ) /

                target;

            const penalty =

                diff > 0

                    ?

                    diff *

                    diff *

                    1.5

                    :

                    diff *

                    diff;

            score +=

                penalty *

                weights[key];

        }

    );

    return score;

};

const scoreRecipeForCategory = (

    recipe,

    targets

) => {

    const categoryRatio =

        mealRatios[recipe.category] ||

        0.25;

    let score = 0;

    nutrients.forEach(

        key => {

            const target =

                Number(

                    targets[key]

                );

            if (

                !target

            ) return;

            const expected =

                target *

                categoryRatio;

            const diff =

                (

                    Number(

                        recipe[key]

                    ) -

                    expected

                ) /

                expected;

            score +=

                diff *

                diff;

        }

    );

    return score;

};

const buildRecipes = rows => {

    const recipeMap = {};

    const ingredientMap = {};

    rows.forEach(

        row => {

            if (

                !recipeMap[row.id]

            ) {

                recipeMap[row.id] = {

                    ...row,

                    calories:

                        Number(

                            row.calories

                        ),

                    protein:

                        Number(

                            row.protein

                        ),

                    carbs:

                        Number(

                            row.carbs

                        ),

                    fat:

                        Number(

                            row.fat

                        ),

                    fiber:

                        Number(

                            row.fiber

                        )

                };

                ingredientMap[row.id] = [];

            }

            if (

                row.ingredient_name

            ) {

                ingredientMap[

                    row.id

                ].push(

                    row.ingredient_name

                );

            }

        }

    );

    return {

        recipes:

            Object.values(

                recipeMap

            ),

        recipeIngredients:

            ingredientMap

    };

};
const optimizeServings = (

    recipes,

    targets

) => {

    const weights = {

        calories: 2,

        protein: 1000,

        carbs: 200,

        fat: 20,

        fiber: 20

    };

    const servings =

        recipes.map(recipe =>

            clamp(

                recipe.calories > 0

                    ?

                    (

                        targets.calories *

                        mealRatios[recipe.category]

                    ) /

                    recipe.calories

                    :

                    1,

                0.25,

                5

            )

        );

    for (

        let iteration = 0;

        iteration < 15;

        iteration++

    ) {

        recipes.forEach(

            (

                recipe,

                recipeIndex

            ) => {

                let numerator = 0;

                let denominator = 0;

                nutrients.forEach(

                    key => {

                        const target =

                            Number(

                                targets[key]

                            );

                        if (

                            target <= 0

                        ) return;

                        const otherTotal =

                            recipes.reduce(

                                (

                                    sum,

                                    current,

                                    index

                                ) =>

                                    index ===

                                    recipeIndex

                                        ?

                                        sum

                                        :

                                        sum +

                                        current[key] *

                                        servings[index],

                                0

                            );

                        const weight =

                            weights[key] /

                            (

                                target *

                                target

                            );

                        numerator +=

                            weight *

                            recipe[key] *

                            (

                                target -

                                otherTotal

                            );

                        denominator +=

                            weight *

                            recipe[key] *

                            recipe[key];

                    }

                );

                if (

                    denominator >

                    0

                ) {

                    servings[

                        recipeIndex

                    ] = clamp(

                        numerator /

                        denominator,

                        0.25,

                        5

                    );

                }

            }

        );

    }

    return recipes.map(

        (

            recipe,

            index

        ) =>

            scaleRecipe(

                recipe,

                servings[index]

            )

    );

};

const calculateConsistency =

targets => {

    const macroCalories =

        round(

            targets.protein *

            4 +

            targets.carbs *

            4 +

            targets.fat *

            9

        );

    const difference =

        round(

            targets.calories -

            macroCalories

        );

    return {

        macro_calories:

            macroCalories,

        calorie_difference:

            difference,

        is_consistent:

            Math.abs(

                difference

            ) <=

            targets.calories *

            0.05,

        suggestions: {

            carbs_if_protein_and_fat_stay:

                Math.max(

                    0,

                    Math.round(

                        (

                            targets.calories -

                            targets.protein *

                            4 -

                            targets.fat *

                            9

                        ) /

                        4

                    )

                ),

            fat_if_protein_and_carbs_stay:

                Math.max(

                    0,

                    Math.round(

                        (

                            targets.calories -

                            targets.protein *

                            4 -

                            targets.carbs *

                            4

                        ) /

                        9

                    )

                ),

            calories_if_macros_stay:

                macroCalories

        }

    };

};
const getMealPlan = async (user) => {

    const [

        targetRows,

        planRows,

        recipeRows

    ] = await Promise.all([

        query(

            `SELECT
                calories,
                protein,
                carbs,
                fat,
                fiber
             FROM nutrition_targets
             WHERE user_id = ?
             LIMIT 1`,

            [user.id]

        ),

        query(

            `SELECT
                calories,
                protein,
                carbs,
                fat,
                fiber
             FROM nutrition_plans
             WHERE user_id = ?
             ORDER BY id DESC
             LIMIT 1`,

            [user.id]

        ),

        query(

            `SELECT
                r.*,
                i.name AS ingredient_name
             FROM recipes r

             LEFT JOIN recipe_ingredients ri
             ON r.id = ri.recipe_id

             LEFT JOIN ingredients i
             ON ri.ingredient_id = i.id`
             + `
             WHERE r.user_id IS NULL
             OR r.user_id = ?`,

            [user.id]

        )

    ]);

    const recommendation =
        generateRecommendation(user);

    const savedPlan =
        planRows[0] ||
        targetRows[0];

    const targets =

        savedPlan

        ?

        {

            calories:
                Number(savedPlan.calories),

            protein:
                Number(savedPlan.protein),

            carbs:
                Number(savedPlan.carbs),

            fat:
                Number(savedPlan.fat),

            fiber:
                Number(savedPlan.fiber),

            source:
                planRows.length
                    ?
                    "nutrition_plans"
                    :
                    "nutrition_targets"

        }

        :

        {

            calories:
                Number(recommendation.calories),

            protein:
                Number(recommendation.protein),

            carbs:
                Number(recommendation.carbs),

            fat:
                Number(

                    recommendation.fat ??

                    recommendation.fats

                ),

            fiber:
                Number(recommendation.fiber),

            source:
                "recommendation"

        };

    const {

        recipes,

        recipeIngredients

    } = buildRecipes(

        recipeRows

    );

    const filteredRecipes =

        filterRecipes(

            recipes,

            recipeIngredients,

            user

        );

    const attachAllergyWarnings = recipe => ({
        ...recipe,
        allergy_warnings:
            getRecipeAllergyWarnings(
                recipe,
                recipeIngredients[recipe.id] || [],
                user.allergy
            )
    });

    const candidates = {};

    Object.keys(

        mealRatios

    ).forEach(

        category => {
            candidates[category] =
    filteredRecipes
    .filter(
        recipe =>
            recipe.category === category
    )
    .sort(
        (
            first,
            second
        ) =>
            scoreRecipeForCategory(
                first,
                targets
            ) -
            scoreRecipeForCategory(
                second,
                targets
            )
    )
    .slice(0,12);

            if (

                candidates[category].length === 0

            ) {

                throw new Error(

                    `No ${category} recipes available`

                );

            }

        }

    );

    let bestMeals = null;

    let bestScore =

        Number.MAX_VALUE;

    for (

        const breakfast of candidates.Breakfast

    ) {

        for (

            const lunch of candidates.Lunch

        ) {

            for (

                const snack of candidates.Snack

            ) {

                for (

                    const dinner of candidates.Dinner

                ) {

                    const meals = [

                        breakfast,

                        lunch,

                        snack,

                        dinner

                    ];

                    const optimized =

                        optimizeServings(

                            meals,

                            targets

                        );

                    const totals =

                        sumPlan(

                            optimized

                        );

                    const score =

                        scorePlan(

                            totals,

                            targets

                        );

                    if (

                        score < bestScore

                    ) {

                        bestScore = score;

                        bestMeals = optimized;

                    }

                }

            }

        }

    }

    const totals =

        sumPlan(

            bestMeals

        );

    const coverage = {};

    nutrients.forEach(

        key => {

            coverage[key] =

                targets[key]

                ?

                Math.round(

                    totals[key] /

                    targets[key] *

                    100

                )

                :

                0;

        }

    );

    return {

        nutrition:

            targets,

        plan_totals:

            totals,

        target_coverage:

            coverage,

        target_consistency:

            calculateConsistency(

                targets

            ),

        breakfast:

            attachAllergyWarnings(
                bestMeals[0]
            ),

        lunch:

            attachAllergyWarnings(
                bestMeals[1]
            ),

        snack:

            attachAllergyWarnings(
                bestMeals[2]
            ),

        dinner:

            attachAllergyWarnings(
                bestMeals[3]
            )

    };

};

module.exports = {

    getMealPlan

};
