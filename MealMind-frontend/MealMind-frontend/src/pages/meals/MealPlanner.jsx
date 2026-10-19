import { useEffect, useState } from "react";

import NutritionSummary from "../../components/meal/NutritionSummary";
import TodayMealCard from "../../components/meal/TodayMealCard";

import {
    getTodayMealPlan
} from "../../api/mealPlanApi";

const nutrientKeys = [
    "calories",
    "protein",
    "carbs",
    "fat",
    "fiber"
];

const mealKeys = [
    "breakfast",
    "lunch",
    "snack",
    "dinner"
];

const roundValue = value =>
    Math.round(
        Number(value || 0) * 10
    ) / 10;

const calculatePlanTotals = plan => {

    const totals = {};

    nutrientKeys.forEach(key => {

        totals[key] =
            roundValue(
                mealKeys.reduce(
                    (
                        sum,
                        mealKey
                    ) =>
                        sum +
                        Number(
                            plan?.[mealKey]?.[key] || 0
                        ),
                    0
                )
            );

    });

    return totals;

};

const calculateCoverage = (
    totals,
    targets
) => {

    const coverage = {};

    nutrientKeys.forEach(key => {

        const target =
            Number(targets?.[key] || 0);

        coverage[key] =
            target
                ? Math.round(
                    Number(totals[key] || 0) /
                    target *
                    100
                )
                : 0;

    });

    return coverage;

};

function MealPlanner() {

    const [mealPlan, setMealPlan] =
    useState(null);

    const [loading, setLoading] =
    useState(true);

    async function loadMealPlan() {

        try {

            const response =
            await getTodayMealPlan();

            setMealPlan(
                response.data
            );

        }

        catch (error) {

            console.log(error);

        }

        finally {

            setLoading(false);

        }

    }

    useEffect(() => {

        // eslint-disable-next-line react-hooks/set-state-in-effect
        loadMealPlan();

    }, []);

    const handleRegenerated =
    (
        mealType,
        recipe
    ) => {

        setMealPlan(prev => {

            const updatedPlan = {

                ...prev,

                [mealType.toLowerCase()]:
                recipe

            };

            const planTotals =
                calculatePlanTotals(
                    updatedPlan
                );

            return {

                ...updatedPlan,

                plan_totals:
                    planTotals,

                target_coverage:
                    calculateCoverage(
                        planTotals,
                        updatedPlan.nutrition
                    )

            };

        });

    };

    if (loading) {

        return (

            <div className="container mt-5">

                <h3>
                    Loading Meal Plan...
                </h3>

            </div>

        );

    }

    if (!mealPlan) {

        return (

            <div className="container mt-5">

                <div className="alert alert-danger">

                    Unable to load meal plan.

                </div>

            </div>

        );

    }

    return (

        <div className="container mt-4">

            <h2 className="mb-4">

                Today's Meal Plan

            </h2>

            <NutritionSummary
                nutrition={
                    mealPlan.plan_totals
                }
                targets={mealPlan.nutrition}
                consistency={
                    mealPlan.target_consistency
                }
            />

            <div className="row mt-4">

                <div className="col-md-6">

                    <TodayMealCard

                        meal={
                            mealPlan.breakfast
                        }

                        mealType="Breakfast"

                        onRegenerated={
                            handleRegenerated
                        }

                    />

                </div>

                <div className="col-md-6">

                    <TodayMealCard

                        meal={
                            mealPlan.lunch
                        }

                        mealType="Lunch"

                        onRegenerated={
                            handleRegenerated
                        }

                    />

                </div>

                <div className="col-md-6">

                    <TodayMealCard

                        meal={
                            mealPlan.snack
                        }

                        mealType="Snack"

                        onRegenerated={
                            handleRegenerated
                        }

                    />

                </div>

                <div className="col-md-6">

                    <TodayMealCard

                        meal={
                            mealPlan.dinner
                        }

                        mealType="Dinner"

                        onRegenerated={
                            handleRegenerated
                        }

                    />

                </div>

            </div>

        </div>

    );

}

export default MealPlanner;
