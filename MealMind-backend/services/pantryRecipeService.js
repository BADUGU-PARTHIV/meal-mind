const db = require('../config/db');

const checkRecipeIngredients = (
    userId,
    recipeId,
    servingMultiplier = 1
) => {

    return new Promise((resolve, reject) => {

        const sql = `
            SELECT
                i.name,
                ri.quantity_g,
                IFNULL(p.quantity,0) AS available,
                p.unit
            FROM recipe_ingredients ri

            JOIN ingredients i
            ON ri.ingredient_id=i.id

            LEFT JOIN pantry_items p
            ON p.item_name=i.name
            AND p.user_id=?

            WHERE ri.recipe_id=?
        `;

        db.query(

            sql,

            [

                userId,

                recipeId

            ],

            (err, results)=>{

                if(err){

                    return reject(err);

                }

                const missing=[];

                results.forEach(item=>{

                    const requiredGrams =
                        Number(item.quantity_g) *
                        Number(servingMultiplier || 1);
                    const availableGrams =
                        item.unit === 'kg'
                            ? Number(item.available) * 1000
                            : item.unit === 'g'
                                ? Number(item.available)
                                : 0;

                    item.available_g = availableGrams;
                    item.required_g = requiredGrams;

                    if (
                        !item.unit ||
                        item.unit === 'pcs' ||
                        availableGrams < requiredGrams
                    ) {

                        missing.push({
                            ...item,
                            reason:
                                item.unit === 'pcs'
                                    ? 'Recipe quantities require g or kg'
                                    : 'Not enough quantity'
                        });

                    }

                });

                resolve({

                    ingredients:results,

                    missing

                });

            }

        );

    });

};

module.exports={

    checkRecipeIngredients

};
