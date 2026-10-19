const {
getAllRecipes,
getRecipeById,
getRecipeIngredients,
getSimilarRecipes,
createRecipe,
addRecipeIngredients
}
= require('../models/recipeModel');
const fs = require('fs');
const path = require('path');
const {
    checkRecipeIngredients
} = require('../services/pantryRecipeService');
const {
    classifyRecipeDiet,
    getRecipeAllergyWarnings
} = require('../services/recipeFilterService');
const {
getUserById
} = require('../models/userModel');

const getCurrentUser = userId => (
    new Promise((resolve, reject) => {
        if (!userId) return resolve({});

        getUserById(
            userId,
            (error, rows) => {
                if (error) return reject(error);
                resolve(rows[0] || {});
            }
        );
    })
);

const attachDietTypes = async (
    recipes,
    user = {}
) => {

    const enriched = [];

    for (const recipe of recipes) {

        const ingredients =
            await new Promise((resolve, reject) => {

                getRecipeIngredients(
                    recipe.id,
                    (error, rows) => {

                        if (error) return reject(error);
                        resolve(
                            rows.map(item => item.name)
                        );

                    }
                );

            });

        enriched.push({
            ...recipe,
            diet_type: classifyRecipeDiet(
                recipe,
                ingredients
            ),
            allergy_warnings: getRecipeAllergyWarnings(
                recipe,
                ingredients,
                user.allergy
            )
        });

    }

    return enriched;

};

const fetchRecipes =
(req,res)=>{

    getAllRecipes(
        req.user?.id,
        async (err,results)=>{

            if(err){

                return res
                .status(500)
                .json(err);

            }

            try {
                const user =
                    await getCurrentUser(
                        req.user?.id
                    );

                const enriched =
                    await attachDietTypes(
                        results,
                        user
                    );

                res.json(enriched);

            }

            catch (dietError) {

                console.log(dietError);

                res.status(500).json({
                    message: 'Unable to classify recipes.'
                });

            }

        }
    );

};

const fetchRecipeDetails =
(req,res)=>{

    const id =
    req.params.id;

    getRecipeById(
        id,
        req.user?.id,
        (err,results)=>{

            if(err){

                return res
                .status(500)
                .json(err);

            }

            if (!results[0]) {
                return res.status(404).json({
                    message: 'Recipe Not Found'
                });
            }

            getRecipeIngredients(
                id,
                async (ingredientError, ingredients) => {

                    if (ingredientError) {
                        return res
                        .status(500)
                        .json(ingredientError);
                    }

                    const user =
                        await getCurrentUser(
                            req.user?.id
                        );

                    const ingredientNames =
                        ingredients.map(item => item.name);

                    res.json({
                        ...results[0],
                        diet_type: classifyRecipeDiet(
                            results[0],
                            ingredientNames
                        ),
                        allergy_warnings: getRecipeAllergyWarnings(
                            results[0],
                            ingredientNames,
                            user.allergy
                        )
                    });

                }
            );

        }
    );

};

const fetchIngredients =
(req,res)=>{

    const id =
    req.params.id;

    getRecipeById(
        id,
        req.user.id,
        (recipeErr, recipeResults) => {

            if (recipeErr) {
                return res
                .status(500)
                .json(recipeErr);
            }

            if (recipeResults.length === 0) {
                return res.status(404).json({
                    message: 'Recipe Not Found'
                });
            }

            getRecipeIngredients(
                id,
                (err,results)=>{

                    if(err){

                        return res
                        .status(500)
                        .json(err);

                    }

                    res.json(results);

                }
            );

        }
    );

};
const pantryStatus = async (req, res) => {

    try {

        const result =
        await checkRecipeIngredients(

            req.user.id,

            req.params.id

        );

        res.json(result);

    }

    catch (error) {

        console.log(error);

        res.status(500).json({

            message: 'Server Error'

        });

    }

};
const fetchSimilarRecipes =
(req,res)=>{

getRecipeById(

req.params.id,

req.user?.id,

(err,recipe)=>{

if(err){

return res.status(500).json(err);

}

if(recipe.length===0){

return res.status(404).json({

message:"Recipe Not Found"

});

}

getSimilarRecipes(

recipe[0].category,

req.params.id,

(err,results)=>{

if(err){

return res.status(500).json(err);

}

res.json(results);

}

);

}

);

};

const saveRecipeImage = (
    imageData,
    userId
) => {

    if (!imageData) {
        return null;
    }

    const match =
        imageData.match(
            /^data:image\/(png|jpeg|jpg|webp);base64,(.+)$/
        );

    if (!match) {
        return null;
    }

    const extension =
        match[1] === 'jpeg'
            ? 'jpg'
            : match[1];

    const uploadDir =
        path.join(
            __dirname,
            '..',
            'uploads',
            'recipes'
        );

    fs.mkdirSync(
        uploadDir,
        {
            recursive: true
        }
    );

    const fileName =
        `${userId}-${Date.now()}.${extension}`;

    fs.writeFileSync(
        path.join(uploadDir, fileName),
        Buffer.from(match[2], 'base64')
    );

    return `/uploads/recipes/${fileName}`;

};

const createCustomRecipe = async (
    req,
    res
) => {

    try {

        const requiredFields = [
            'name',
            'category',
            'diet_type'
        ];

        const missingField =
            requiredFields.find(
                field => !req.body[field]
            );

        if (missingField) {
            return res.status(400).json({
                message: 'Recipe name, meal category, and diet type are required.'
            });
        }

        const imageUrl =
            saveRecipeImage(
                req.body.image_data,
                req.user.id
            );

        const recipeData = {
            user_id: req.user.id,
            name: req.body.name,
            category: req.body.category,
            description: req.body.description || '',
            instructions: req.body.instructions || '',
            calories: Number(req.body.calories || 0),
            protein: Number(req.body.protein || 0),
            carbs: Number(req.body.carbs || 0),
            fat: Number(req.body.fat || 0),
            fiber: Number(req.body.fiber || 0),
            image_url: imageUrl,
            diet_type: req.body.diet_type,
            cooking_time: Number(req.body.cooking_time || 20),
            difficulty: req.body.difficulty || 'Easy',
            rating: 4.5,
            tags: req.body.tags || 'Custom'
        };

        createRecipe(
            recipeData,
            async (error, result) => {

                if (error) {
                    console.log(error);
                    return res.status(500).json({
                        message: 'Unable to save recipe.'
                    });
                }

                try {

                    await addRecipeIngredients(
                        result.insertId,
                        req.body.ingredients || []
                    );

                    res.status(201).json({
                        message: 'Recipe Added Successfully',
                        id: result.insertId
                    });

                }

                catch (ingredientError) {

                    console.log(ingredientError);

                    res.status(500).json({
                        message: 'Recipe saved, but ingredients could not be saved.'
                    });

                }

            }
        );

    }

    catch (error) {

        console.log(error);

        res.status(500).json({
            message: 'Unable to save recipe.'
        });

    }

};
module.exports = {

    fetchRecipes,
    fetchRecipeDetails,
    fetchIngredients,
    pantryStatus,
    fetchSimilarRecipes,
    createCustomRecipe
};
