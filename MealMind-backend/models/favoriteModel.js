const db = require('../config/db');

const addFavorite = (
    data,
    callback
) => {

    const sql = `
        INSERT INTO favorites
        (
            user_id,
            recipe_id,
            recipe_name,
            recipe_image
        )
        VALUES (?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
            recipe_name = VALUES(recipe_name),
            recipe_image = VALUES(recipe_image)
    `;

    db.query(
        sql,
        [
            data.user_id,
            data.recipe_id,
            data.recipe_name,
            data.recipe_image
        ],
        callback
    );

};

const getFavoritesByUserId = (
    userId,
    callback
) => {

    const sql = `
        SELECT *
        FROM favorites
        WHERE user_id = ?
        ORDER BY created_at DESC
    `;

    db.query(
        sql,
        [userId],
        callback
    );

};

const deleteFavorite = (
    id,
    userId,
    callback
) => {

    const sql = `
        DELETE FROM favorites
        WHERE id = ?
        AND user_id = ?
    `;

    db.query(
        sql,
        [id, userId],
        callback
    );

};

const getFavoriteByRecipeId = (
    userId,
    recipeId,
    callback
) => {

    const sql = `
        SELECT *
        FROM favorites
        WHERE user_id = ?
        AND recipe_id = ?
        LIMIT 1
    `;

    db.query(
        sql,
        [
            userId,
            recipeId
        ],
        callback
    );

};

const deleteFavoriteByRecipeId = (
    userId,
    recipeId,
    callback
) => {

    const sql = `
        DELETE FROM favorites
        WHERE user_id = ?
        AND recipe_id = ?
    `;

    db.query(
        sql,
        [
            userId,
            recipeId
        ],
        callback
    );

};

module.exports = {
    addFavorite,
    getFavoritesByUserId,
    getFavoriteByRecipeId,
    deleteFavorite,
    deleteFavoriteByRecipeId
};
