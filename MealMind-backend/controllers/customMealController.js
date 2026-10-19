const {

    addCustomMeal

} = require("../models/customMealModel");

const saveCustomMeal = async (

    req,

    res

) => {

    try {

        const {

            meal_type,

            foods

        } = req.body;

        const savedFoods = [];

        for (const food of foods) {

            const savedFood = await addCustomMeal({

                user_id: req.user.id,

                meal_type,

                food_name: food.food_name,

                quantity: Number(food.quantity),

                consumed_date:
                    req.body.consumed_date ||
                    new Date().toISOString().split("T")[0]

            });

            savedFoods.push(savedFood);

        }

        res.json({

            message:

                "Meal Logged Successfully",

            foods: savedFoods

        });

    }

    catch (error) {

        console.log(error);

        res.status(400).json({

            message:

                error.message ||

                "Unable To Save Meal"

        });

    }

};

module.exports = {

    saveCustomMeal

};
