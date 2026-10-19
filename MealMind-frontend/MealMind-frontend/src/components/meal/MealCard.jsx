import { Link }
from "react-router-dom";

import {
  completeMeal
}
from "../../api/mealCompletionApi";

function MealCard({ meal }) {

  const handleComplete =
  async () => {

    try {

      await completeMeal({

        food_name:
        meal.food_name,

        quantity:
        meal.quantity,

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
        .split("T")[0]

      });

      alert(
        "Meal Logged Successfully"
      );

    }

    catch (error) {

      console.log(error);

    }

  };

  return (

    <div
      className="card shadow border-0 h-100"
      style={{
        borderRadius: "20px"
      }}
    >

      <div className="card-body">

        <div className="d-flex justify-content-between align-items-center mb-3">

          <span className="badge bg-success">

            {meal.meal_type}

          </span>

          <span className="badge bg-primary">

            {meal.calories} kcal

          </span>

        </div>

        <h4
          className="fw-bold mb-3"
        >

          {meal.food_name}

        </h4>

        <div className="row text-center mb-4">

          <div className="col">

            <small>
              Protein
            </small>

            <h6>

              💪 {meal.protein}g

            </h6>

          </div>

          <div className="col">

            <small>
              Carbs
            </small>

            <h6>

              🍚 {meal.carbs}g

            </h6>

          </div>

          <div className="col">

            <small>
              Fat
            </small>

            <h6>

              🥑 {meal.fat}g

            </h6>

          </div>

        </div>

        <div className="mb-3">

          <small>

            Fiber

          </small>

          <div
            className="progress"
            style={{
              height: "10px"
            }}
          >

            <div
              className="progress-bar bg-success"
              style={{
                width:
                `${Math.min(
                  meal.fiber * 5,
                  100
                )}%`
              }}
            />

          </div>

        </div>

        <div
          className="d-flex gap-2"
        >

          <Link
            to={`/recipe/${meal.recipe_id}`}
            className="btn btn-outline-primary w-50"
          >

            View Recipe

          </Link>

          <button
            className="btn btn-success w-50"
            onClick={handleComplete}
          >

            Complete

          </button>

        </div>

      </div>

    </div>

  );

}

export default MealCard;