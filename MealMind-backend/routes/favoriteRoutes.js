const express =
require('express');

const router =
express.Router();

const authMiddleware =
require('../middleware/authMiddleware');

const {

    createFavorite,

    getFavorites,

    getFavoriteStatus,

    removeFavorite,

    removeFavoriteByRecipe

} = require(
'../controllers/favoriteController'
);

router.post(
    '/favorites',
    authMiddleware,
    createFavorite
);

router.get(
    '/favorites',
    authMiddleware,
    getFavorites
);

router.get(
    '/favorites/recipe/:recipeId',
    authMiddleware,
    getFavoriteStatus
);

router.delete(
    '/favorites/recipe/:recipeId',
    authMiddleware,
    removeFavoriteByRecipe
);

router.delete(
    '/favorites/:id',
    authMiddleware,
    removeFavorite
);

module.exports =
router;
