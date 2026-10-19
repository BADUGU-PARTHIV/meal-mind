const generateInsights = (dashboard, nutrition) => {

    const insights = [];

    const remainingCalories =
        nutrition.calories -
        dashboard.totalCalories;

    if (remainingCalories > 0) {

        insights.push(
            `🔥 ${remainingCalories} kcal remaining today.`
        );

    } else {

        insights.push(
            "🎉 Daily calorie goal achieved."
        );

    }

    const remainingProtein =
        nutrition.protein -
        dashboard.totalProtein;

    if (remainingProtein > 0) {

        insights.push(
            `💪 Eat ${remainingProtein}g more protein.`
        );

    } else {

        insights.push(
            "💪 Protein goal completed."
        );

    }

    const remainingWater =
        3.5 - dashboard.waterIntake;

    if (remainingWater > 0) {

        insights.push(
            `💧 Drink ${remainingWater.toFixed(1)}L more water.`
        );

    } else {

        insights.push(
            "💧 Hydration goal completed."
        );

    }

    if (dashboard.shoppingCount > 0) {

        insights.push(
            `🛒 ${dashboard.shoppingCount} shopping items pending.`
        );

    }

    if (dashboard.lowStockCount > 0) {

        insights.push(
            `⚠️ ${dashboard.lowStockCount} pantry items are low.`
        );

    }

    return insights;

};

module.exports = {

    generateInsights

};