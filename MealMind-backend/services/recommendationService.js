const generateRecommendation = (user) => {

    const weight = Number(user.weight);
    const height = Number(user.height);
    const age = Number(user.age);

    let bmr;

    if (user.gender === 'Male') {

        bmr =
            (10 * weight) +
            (6.25 * height) -
            (5 * age) +
            5;

    } else {

        bmr =
            (10 * weight) +
            (6.25 * height) -
            (5 * age) -
            161;

    }

    let activityMultiplier = 1.2;

    switch (user.activity_level) {

        case 'Light':
            activityMultiplier = 1.375;
            break;

        case 'Moderate':
            activityMultiplier = 1.55;
            break;

        case 'Heavy':
            activityMultiplier = 1.725;
            break;

        case 'Athlete':
            activityMultiplier = 1.9;
            break;

        default:
            activityMultiplier = 1.2;
    }

    const tdee = bmr * activityMultiplier;

    let calories = tdee;

    if (user.goal === 'Bulk') {
        calories = tdee + 300;
    }

    if (user.goal === 'Loss') {
        calories = tdee - 300;
    }

    if (user.goal === 'Maintain') {
        calories = tdee;
    }

    let proteinMultiplier = 1.6;

    if (user.goal === 'Bulk') {
        proteinMultiplier = 2.0;
    }

    if (user.goal === 'Loss') {
        proteinMultiplier = 2.2;
    }

    const protein = weight * proteinMultiplier;

    const fats = (calories * 0.25) / 9;

    const carbs =
        (
            calories -
            (protein * 4) -
            (fats * 9)
        ) / 4;

    const fiber = (calories / 1000) * 14;

    return {
        bmr: Math.round(bmr),
        tdee: Math.round(tdee),
        calories: Math.round(calories),
        protein: Math.round(protein),
        carbs: Math.round(carbs),
        fats: Math.round(fats),
        fiber: Math.round(fiber)
    };

};

module.exports = {
    generateRecommendation
};