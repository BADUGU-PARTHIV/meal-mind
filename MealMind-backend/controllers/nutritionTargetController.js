const {

    getNutritionTarget,

    saveNutritionTarget

} = require("../models/nutritionTargetModel");

const fetchNutritionTarget = (

    req,

    res

) => {

    getNutritionTarget(

        req.user.id,

        (err, results) => {

            if (err) {

                return res.status(500).json(err);

            }

            if (results.length === 0) {

                return res.json(null);

            }

            res.json(results[0]);

        }

    );

};

const updateNutritionTarget = (

    req,

    res

) => {

    saveNutritionTarget(

        {

            user_id: req.user.id,

            calories: req.body.calories,

            protein: req.body.protein,

            carbs: req.body.carbs,

            fat: req.body.fat,

            fiber: req.body.fiber

        },

        (err) => {

            if (err) {

                return res.status(500).json(err);

            }

            res.json({

                message: "Nutrition Target Saved"

            });

        }

    );

};

module.exports = {

    fetchNutritionTarget,

    updateNutritionTarget

};