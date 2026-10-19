import { useState } from "react";
import { Link } from "react-router-dom";
import {
    completeMeal,
    uncompleteMeal
} from "../../api/mealCompletionApi";
import { regenerateMeal } from "../../api/mealPlanApi";
import {
    getImageUrl
} from "../../utils/imageUrl";

function TodayMealCard({
    
    meal,

    mealType,

    onRegenerated

}) 
{
    const [completedLogId, setCompletedLogId] =
        useState(null);
    const [updatingCompletion, setUpdatingCompletion] =
        useState(false);
    const [regenerating, setRegenerating] =
        useState(false);
    const [excludedRecipeIds, setExcludedRecipeIds] =
useState([meal.id]);

    const handleComplete =
    async () => {

        try {

            setUpdatingCompletion(true);

            if (completedLogId) {

                await uncompleteMeal(
                    completedLogId,
                    meal.id,
                    meal.serving_multiplier
                );

                setCompletedLogId(null);
                return;

            }

            const response = await completeMeal({
                recipe_id: meal.id,
                food_name:meal.name,

                quantity:
                    meal.serving_multiplier || 1,

                calories:
                meal.calories,

                protein:
                meal.protein,

                carbs:
                meal.carbs,

                fat:
                meal.fat,

                fiber:
                meal.fiber,

                consumed_date:
                new Date()
                .toISOString()
                .split("T")[0],

                meal_context: "routine"

            });

            setCompletedLogId(
                response.data.food_log_id
            );

        }

        catch (error) {

            console.log(error);

            alert(
                error.response?.data?.message ||
                "Unable to update this meal. Please try again."
            );

        }

        finally {

            setUpdatingCompletion(false);

        }

    };

    const handleRegenerate =
async () => {

    try {

        setRegenerating(true);

        const response =
        await regenerateMeal({

            meal: mealType,

            currentRecipeId: meal.id,

            excludedRecipeIds

        });

        if (!response.data) {

            alert(
                "No more recipes available."
            );

            return;

        }

        setExcludedRecipeIds(prev => [

            ...prev,

            response.data.id

        ]);

        onRegenerated(

            mealType,

            response.data

        );

        if (response.data.allergy_warnings?.length > 0) {
            alert(
                `Careful: this regenerated meal may contain ${response.data.allergy_warnings.join(", ")}.`
            );
        }

    }

    catch (error) {

        console.log(error);

    }

    finally {

        setRegenerating(false);

    }

};

    return (

        <div
            className="card shadow border-0 mb-4"
            style={{
                borderRadius: "20px",
                position: "relative",
                overflow: "hidden"
            }}
        >

            {completedLogId && (
                <div
                    className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
                    style={{
                        background: "rgba(90, 90, 90, 0.58)",
                        zIndex: 2,
                        pointerEvents: "none"
                    }}
                >
                    <span className="badge bg-dark fs-5 px-4 py-3">
                        ✓ Meal Completed
                    </span>
                </div>
            )}

            <img

                src={getImageUrl(meal.image_url)}

                alt={meal.name}

                className="card-img-top"

                style={{
                    height: "220px",
                    objectFit: "cover"
                }}

            />

            <div className="card-body">

                <div className="d-flex justify-content-between">

                    <span className="badge bg-success">

                        {mealType}

                    </span>

                    <span className="badge bg-primary">

                        {meal.calories} kcal

                    </span>

                </div>

                <div className="mt-2">
                    <span className="badge bg-info text-dark">
                        {meal.serving_multiplier || 1} serving(s)
                    </span>
                    {meal.allergy_warnings?.length > 0 ? (
                        <span className="badge bg-danger ms-2">
                            🚨 May contain {meal.allergy_warnings.join(", ")}
                        </span>
                    ) : null}
                </div>

                <h4 className="mt-3">

                    {meal.name}

                </h4>

                <p className="text-muted">

                    {meal.description}

                </p>

                <div className="row text-center mt-3">

                    <div className="col">

                        <small>

                            Protein

                        </small>

                        <h6>

                            {meal.protein} g

                        </h6>

                    </div>

                    <div className="col">

                        <small>

                            Carbs

                        </small>

                        <h6>

                            {meal.carbs} g

                        </h6>

                    </div>

                    <div className="col">

                        <small>

                            Fat

                        </small>

                        <h6>

                            {meal.fat} g

                        </h6>

                    </div>

                </div>
                                <hr />

                <div className="row text-center">

                    <div className="col">

                        <small>Fiber</small>

                        <h6>{meal.fiber} g</h6>

                    </div>

                    <div className="col">

                        <small>Vitamin D</small>

                        <h6>{meal.vitamin_d}</h6>

                    </div>

                    <div className="col">

                        <small>B12</small>

                        <h6>{meal.vitamin_b12}</h6>

                    </div>

                </div>

                <div className="row text-center mt-3">

                    <div className="col">

                        <small>Calcium</small>

                        <h6>{meal.calcium}</h6>

                    </div>

                    <div className="col">

                        <small>Iron</small>

                        <h6>{meal.iron}</h6>

                    </div>

                    <div className="col">

                        <small>Zinc</small>

                        <h6>{meal.zinc}</h6>

                    </div>

                </div>

                <div
                    className="d-flex gap-2 mt-4"
                    style={{
                        position: "relative",
                        zIndex: 3
                    }}
                >

                    <Link
                        to={`/recipe/${meal.id}`}
                        className="btn btn-outline-primary w-100"
                    >

                        View Recipe

                    </Link>

                    <button
                        className="btn btn-warning w-100"
                        onClick={handleRegenerate}
                        disabled={regenerating}
                    >

                        {
                            regenerating
                                ? "Regenerating..."
                                : "Regenerate"
                        }

                    </button>

                    <button
                        className={
                            completedLogId
                                ? "btn btn-light w-100"
                                : "btn btn-success w-100"
                        }
                        onClick={handleComplete}
                        disabled={updatingCompletion}
                    >

                        {
                            updatingCompletion
                                ? "Updating..."
                                : completedLogId
                                    ? "Completed ✓"
                                    : "Complete"
                        }

                    </button>

                </div>

            </div>

        </div>

    );

}

export default TodayMealCard;
