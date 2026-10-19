const {
getNutritionPlan,
updateNutritionPlan
} = require('../models/nutritionPlanModel');

const getUserNutritionPlan = (
req,
res
) => {


const userId =
    req.user.id;

getNutritionPlan(
    userId,
    (err, results) => {

        if (err) {

            return res.status(500).json({
                message:
                    'Failed To Fetch Nutrition Plan'
            });

        }

        if (
            results.length === 0
        ) {

            return res.status(404).json({
                message:
                    'Nutrition Plan Not Found'
            });

        }

        res.status(200).json(
            results[0]
        );

    }
);


};

const updateUserNutritionPlan = (
req,
res
) => {


const userId =
    req.user.id;

updateNutritionPlan(

    userId,

    req.body,

    (err) => {

        if (err) {

            console.log(err);

            return res.status(500).json({
                message:
                    'Nutrition Plan Update Failed'
            });

        }

        res.status(200).json({

            message:
                'Nutrition Plan Updated'

        });

    }

);


};

module.exports = {
getUserNutritionPlan,
updateUserNutritionPlan
};
