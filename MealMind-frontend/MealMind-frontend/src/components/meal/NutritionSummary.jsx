import { Link } from "react-router-dom";

const nutrients = [
  {
    key: "calories",
    label: "Calories",
    icon: "🔥",
    unit: "kcal"
  },
  {
    key: "protein",
    label: "Protein",
    icon: "💪",
    unit: "g"
  },
  {
    key: "carbs",
    label: "Carbs",
    icon: "🍚",
    unit: "g"
  },
  {
    key: "fat",
    label: "Fat",
    icon: "🥑",
    unit: "g"
  },
  {
    key: "fiber",
    label: "Fiber",
    icon: "🌾",
    unit: "g"
  }
];

function NutritionSummary({
  nutrition,
  targets,
  consistency
}) {
  return (
    <div
      className="card shadow border-0 mb-4"
      style={{ borderRadius: "20px" }}
    >
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h3 className="fw-bold mb-1">
              Planned Daily Nutrition
            </h3>
            <small className="text-muted">
              Four-meal total compared with your dashboard goals
            </small>
          </div>
          <span className="badge bg-success">
            Optimized Plan
          </span>
        </div>

        {consistency && !consistency.is_consistent && (
          <div className="alert alert-warning">
            <div className="d-flex justify-content-between gap-3 align-items-start">
              <div>
                Your custom macros provide approximately{" "}
                <strong>{consistency.macro_calories} kcal</strong>,
                but your calorie target is{" "}
                <strong>{targets.calories} kcal</strong>. The meal
                plan cannot keep every nutrient between 95% and 105%
                until these targets match.
              </div>
              <Link
                to="/diet-plan"
                className="btn btn-sm btn-outline-dark text-nowrap"
              >
                Change macros
              </Link>
            </div>
            <div className="mt-2">
              To fix it, either set calories near{" "}
              <strong>
                {consistency.suggestions?.calories_if_macros_stay} kcal
              </strong>
              , or keep calories at{" "}
              <strong>{targets.calories} kcal</strong> and change one
              macro target — for example carbs near{" "}
              <strong>
                {consistency.suggestions?.carbs_if_protein_and_fat_stay}g
              </strong>
              {" "}or fat near{" "}
              <strong>
                {consistency.suggestions?.fat_if_protein_and_carbs_stay}g
              </strong>.
            </div>
          </div>
        )}

        <div className="row g-3">
          {nutrients.map(item => {
            const planned = Number(
              nutrition?.[item.key] || 0
            );
            const goal = Number(
              targets?.[item.key] || 0
            );
            const percentage = goal
              ? Math.round(planned / goal * 100)
              : 0;

            return (
              <div
                className="col-sm-6 col-lg"
                key={item.key}
              >
                <div className="border rounded p-3 h-100">
                  <div className="fs-4">{item.icon}</div>
                  <strong>{item.label}</strong>
                  <div className="mt-1">
                    {planned} / {goal} {item.unit}
                  </div>
                  <div className="progress mt-2" style={{ height: "8px" }}>
                    <div
                      className={
                        percentage >= 100
                          ? "progress-bar bg-success"
                          : "progress-bar bg-warning"
                      }
                      style={{
                        width: `${Math.min(percentage, 100)}%`
                      }}
                    />
                  </div>
                  <small
                    className={
                      percentage >= 100
                        ? "text-success"
                        : "text-muted"
                    }
                  >
                    {percentage}% covered
                  </small>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default NutritionSummary;
