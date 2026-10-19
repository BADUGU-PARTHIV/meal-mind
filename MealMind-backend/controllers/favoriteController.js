const {
    addFavorite,
    getFavoritesByUserId,
    getFavoriteByRecipeId,
    deleteFavorite,
    deleteFavoriteByRecipeId
} = require('../models/favoriteModel');

const createFavorite = (
    req,
    res
) => {

    const data = {
        user_id: req.user.id,
        recipe_id: req.body.recipe_id || req.body.recipeId,
        recipe_name: req.body.recipe_name || req.body.name,
        recipe_image: req.body.recipe_image || req.body.image
    };

    if (!data.recipe_id || !data.recipe_name) {
        return res.status(400).json({
            message: 'Recipe id and name are required'
        });
    }

    addFavorite(
        data,
        (err) => {

            if (err) {
                console.log(err);
                return res.status(500).json({
                    message: 'Failed To Save Favorite'
                });
            }

            res.json({
                message: 'Favorite Added'
            });

        }
    );

};

const getFavorites = (
    req,
    res
) => {

    getFavoritesByUserId(
        req.user.id,
        (err, results) => {

            if (err) {
                return res.status(500).json({
                    message: 'Database Error'
                });
            }

            res.json(results);

        }
    );

};

const getFavoriteStatus = (
    req,
    res
) => {

    getFavoriteByRecipeId(
        req.user.id,
        req.params.recipeId,
        (err, results) => {

            if (err) {
                return res.status(500).json({
                    message: 'Database Error'
                });
            }

            res.json({
                isFavorite: results.length > 0,
                favorite: results[0] || null
            });

        }
    );

};

const removeFavorite = (
    req,
    res
) => {

    deleteFavorite(
        req.params.id,
        req.user.id,
        (err) => {

            if (err) {
                return res.status(500).json({
                    message: 'Delete Failed'
                });
            }

            res.json({
                message: 'Favorite Removed'
            });

        }
    );

};

const removeFavoriteByRecipe = (
    req,
    res
) => {

    deleteFavoriteByRecipeId(
        req.user.id,
        req.params.recipeId,
        (err) => {

            if (err) {
                return res.status(500).json({
                    message: 'Delete Failed'
                });
            }

            res.json({
                message: 'Favorite Removed'
            });

        }
    );

};

module.exports = {
    createFavorite,
    getFavorites,
    getFavoriteStatus,
    removeFavorite,
    removeFavoriteByRecipe
};
