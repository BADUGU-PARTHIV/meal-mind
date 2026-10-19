const scoreRecipe = (
    recipe,
    target,
    deficiency
) => {

    let score = 0;

    score +=
    Math.abs(
        recipe.calories -
        target.calories
    );

    score +=
    Math.abs(
        recipe.protein -
        target.protein
    );

    score +=
    Math.abs(
        recipe.carbs -
        target.carbs
    );

    score +=
    Math.abs(
        recipe.fat -
        target.fat
    );

    score +=
    Math.abs(
        recipe.fiber -
        target.fiber
    );

    if (deficiency) {

        switch (deficiency) {

            case 'Vitamin D':

                score -=
                Number(
                    recipe.vitamin_d
                ) * 100;

                break;

            case 'Vitamin B12':

                score -=
                Number(
                    recipe.vitamin_b12
                ) * 10;

                break;

            case 'Vitamin A':

                score -=
                Number(
                    recipe.vitamin_a
                ) * 0.1;

                break;

            case 'Vitamin C':

                score -=
                Number(
                    recipe.vitamin_c
                ) * 0.1;

                break;

            case 'Iron':

                score -=
                Number(
                    recipe.iron
                ) * 10;

                break;

            case 'Calcium':

                score -=
                Number(
                    recipe.calcium
                ) * 0.05;

                break;

            case 'Magnesium':

                score -=
                Number(
                    recipe.magnesium
                ) * 0.05;

                break;

            case 'Potassium':

                score -=
                Number(
                    recipe.potassium
                ) * 0.01;

                break;

            case 'Zinc':

                score -=
                Number(
                    recipe.zinc
                ) * 10;

                break;

        }

    }

    return score;

};

module.exports = {
    scoreRecipe
};