const calculateNutrition = (profile) => {

    const age =
        Number(profile.age);

    const weight =
        Number(profile.weight);

    const height =
        Number(profile.height);

    const gender =
        profile.gender;

    const activityLevel =
        profile.activity_level ||
        profile.activityLevel;

    const goal =
        profile.goal;

    let bmr;

    if (gender === "Male") {

        bmr =
            10 * weight +
            6.25 * height -
            5 * age +
            5;

    } else {

        bmr =
            10 * weight +
            6.25 * height -
            5 * age -
            161;

    }

    let activityMultiplier = 1.55;

    if (activityLevel === "Sedentary") {

        activityMultiplier = 1.2;

    }

    if (activityLevel === "Moderate") {

        activityMultiplier = 1.55;

    }

    if (activityLevel === "Active") {

        activityMultiplier = 1.725;

    }

    let calories =
        Math.round(
            bmr *
            activityMultiplier
        );

    if (goal === "Bulk") {

        calories += 300;

    }

    if (goal === "Cut") {

        calories -= 300;

    }

    const protein =
        Math.round(
            weight * 2.2
        );

    const fat =
        Math.round(
            calories * 0.25 / 9
        );

    const carbs =
        Math.round(
            (
                calories -
                protein * 4 -
                fat * 9
            ) / 4
        );

    return {


calories,

protein,

carbs,

fat,

fiber: 35,

vitaminA: 900,

vitaminC: 90,

vitaminD: 15,

vitaminB12: 2.4,

calcium: 1000,

iron: 18,

magnesium: 420,

potassium: 3500,

zinc: 11


};
}

module.exports = calculateNutrition;
