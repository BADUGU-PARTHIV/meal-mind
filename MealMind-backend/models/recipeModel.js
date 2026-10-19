const db = require('../config/db');

const getAllRecipes = (
    userId,
    callback
) => {
    db.query(
        `SELECT *
         FROM recipes
         WHERE user_id IS NULL
         OR user_id = ?
         ORDER BY is_custom DESC, name`,
        [userId || 0],
        callback
    );
};

const getRecipeById = (
    id,
    userId,
    callback
) => {
    db.query(
        `SELECT *
         FROM recipes
         WHERE id = ?
         AND (user_id IS NULL OR user_id = ?)`,
        [id, userId || 0],
        callback
    );
};

const createRecipe = (
    data,
    callback
) => {

    const sql = `
        INSERT INTO recipes
        (
            user_id,
            is_custom,
            name,
            category,
            description,
            instructions,
            calories,
            protein,
            carbs,
            fat,
            fiber,
            image_url,
            diet_type,
            cooking_time,
            difficulty,
            rating,
            tags
        )
        VALUES
        (?, 1, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(
        sql,
        [
            data.user_id,
            data.name,
            data.category,
            data.description,
            data.instructions,
            data.calories,
            data.protein,
            data.carbs,
            data.fat,
            data.fiber,
            data.image_url,
            data.diet_type,
            data.cooking_time,
            data.difficulty,
            data.rating,
            data.tags
        ],
        callback
    );

};

const findOrCreateIngredient = (
    name
) => (
    new Promise((resolve, reject) => {

        db.query(
            `INSERT INTO ingredients (name, category)
             VALUES (?, 'Custom')
             ON DUPLICATE KEY UPDATE id = LAST_INSERT_ID(id)`,
            [name],
            (error, result) => {

                if (error) return reject(error);
                resolve(result.insertId);

            }
        );

    })
);

const addRecipeIngredients = async (
    recipeId,
    ingredients = []
) => {

    for (const ingredient of ingredients) {

        if (
            !ingredient.name ||
            !Number.isFinite(Number(ingredient.quantity_g)) ||
            Number(ingredient.quantity_g) <= 0
        ) {
            continue;
        }

        const ingredientId =
            await findOrCreateIngredient(
                ingredient.name.trim()
            );

        await db.promise().query(
            `INSERT INTO recipe_ingredients
             (
                recipe_id,
                ingredient_id,
                quantity_g,
                unit
             )
             VALUES (?, ?, ?, 'g')`,
            [
                recipeId,
                ingredientId,
                Number(ingredient.quantity_g)
            ]
        );

    }

};

const getRecipeIngredients = (
    recipeId,
    callback
) => {

    db.query(
        `
        SELECT
        i.name,
        ri.quantity_g
        FROM recipe_ingredients ri
        JOIN ingredients i
        ON ri.ingredient_id=i.id
        WHERE ri.recipe_id=?
        `,
        [recipeId],
        callback
    );

};
const getSimilarRecipes = (
    category,
    recipeId,
    callback
) => {

    const sql = `
        SELECT
            id,
            name,
            image_url,
            calories,
            protein
        FROM recipes
        WHERE category = ?
        AND id != ?
        ORDER BY RAND()
        LIMIT 4
    `;

    db.query(
        sql,
        [
            category,
            recipeId
        ],
        callback
    );

};
module.exports = {
    getAllRecipes,
    getRecipeById,
    createRecipe,
    addRecipeIngredients,
    getRecipeIngredients,
    getSimilarRecipes
};
