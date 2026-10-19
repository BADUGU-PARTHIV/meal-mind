const generateShoppingList = (nutrition, profile = {}) => {

    const proteinFactor =
        nutrition.protein / 140;

    const carbFactor =
        nutrition.carbs / 350;

    const commonItems = [

        {
            item_name: "Oats",
            quantity: Math.max(
                1,
                Math.round(
                    5 * carbFactor
                )
            ),
            unit: "kg"
        },

        {
            item_name: "Rice",
            quantity: Math.max(
                1,
                Math.round(
                    15 * carbFactor
                )
            ),
            unit: "kg"
        },

        {
            item_name: "Bananas",
            quantity: 60,
            unit: "pcs"
        }

    ];

    const dietType = String(
        profile.diet_type || profile.dietType || 'Non-Veg'
    ).toLowerCase();

    let proteinItems;

    if (dietType === 'vegan') {
        proteinItems = [
            { item_name: 'Lentils', quantity: Math.max(1, Math.round(8 * proteinFactor)), unit: 'kg' },
            { item_name: 'Tofu', quantity: Math.max(1, Math.round(6 * proteinFactor)), unit: 'kg' }
        ];
    } else if (dietType === 'veg') {
        proteinItems = [
            { item_name: 'Lentils', quantity: Math.max(1, Math.round(6 * proteinFactor)), unit: 'kg' },
            { item_name: 'Paneer', quantity: Math.max(1, Math.round(6 * proteinFactor)), unit: 'kg' }
        ];
    } else {
        proteinItems = [
            { item_name: 'Eggs', quantity: Math.max(1, Math.round(90 * proteinFactor)), unit: 'pcs' },
            { item_name: 'Chicken Breast', quantity: Math.max(1, Math.round(8 * proteinFactor)), unit: 'kg' }
        ];
    }

    const allergies = String(profile.allergy || '')
        .toLowerCase()
        .split(',')
        .map((allergy) => allergy.trim())
        .filter(Boolean);

    return [...commonItems, ...proteinItems].filter((item) =>
        !allergies.some((allergy) =>
            item.item_name.toLowerCase().includes(allergy)
        )
    );

};

module.exports =
generateShoppingList;
