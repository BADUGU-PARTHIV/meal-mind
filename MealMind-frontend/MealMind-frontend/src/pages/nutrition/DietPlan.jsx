import {
    useEffect,
    useState
} from "react";

import {
    getNutritionPlan,
    updateNutritionPlan
} from "../../api/nutritionApi";

import {
    getNutritionTarget,
    saveNutritionTarget
} from "../../api/nutritionTargetApi";

function DietPlan() {

    const [plan, setPlan] =
        useState(null);

    const getMacroCalories = (values) =>
        Math.round(
            Number(values.protein || 0) * 4 +
            Number(values.carbs || 0) * 4 +
            Number(values.fat || 0) * 9
        );

    const getConsistencyWarning = (values) => {

        const calories =
            Number(values.calories || 0);

        const macroCalories =
            getMacroCalories(values);

        const difference =
            Math.abs(calories - macroCalories);

        if (
            !calories ||
            difference <= calories * 0.05
        ) {

            return null;

        }

        const carbsNeeded =
            Math.max(
                0,
                Math.round(
                    (
                        calories -
                        Number(values.protein || 0) * 4 -
                        Number(values.fat || 0) * 9
                    ) / 4
                )
            );

        const fatNeeded =
            Math.max(
                0,
                Math.round(
                    (
                        calories -
                        Number(values.protein || 0) * 4 -
                        Number(values.carbs || 0) * 4
                    ) / 9
                )
            );

        return {
            macroCalories,
            carbsNeeded,
            fatNeeded
        };

    };

    const loadPlan = async () => {

        try {

            const response =
                await getNutritionPlan();

            let nutrition =
                response.data;

            const target =
                await getNutritionTarget();

            if (target.data) {

                nutrition = {

                    ...nutrition,

                    calories:
                        target.data.calories,

                    protein:
                        target.data.protein,

                    carbs:
                        target.data.carbs,

                    fat:
                        target.data.fat,

                    fiber:
                        target.data.fiber

                };

            }

            setPlan(nutrition);

        }

        catch (error) {

            console.log(error);

        }

    };

    useEffect(() => {

        // eslint-disable-next-line react-hooks/set-state-in-effect
        loadPlan();

    }, []);

    if (!plan) {

        return (

            <div className="container mt-4">

                <div className="alert alert-info">

                    Loading Diet Plan...

                </div>

            </div>

        );

    }

    const updateValue = (

        field,

        amount

    ) => {

        setPlan(prev => ({

            ...prev,

            [field]:

                Math.max(

                    0,

                    Number(prev[field]) + amount

                )

        }));

    };

    const savePlan = async () => {

        try {

            const warning =
                getConsistencyWarning(plan);

            if (warning) {

                alert(
                    `These targets cannot make a meal plan where every nutrient is 95% to 105%.\n\n` +
                    `Your protein, carbs, and fat equal about ${warning.macroCalories} kcal, but calories are set to ${plan.calories} kcal.\n\n` +
                    `Fix it by setting calories near ${warning.macroCalories} kcal, or keep ${plan.calories} kcal and set carbs near ${warning.carbsNeeded}g or fat near ${warning.fatNeeded}g.`
                );

                return;

            }

            await updateNutritionPlan({

                calories:
                    plan.calories,

                protein:
                    plan.protein,

                carbs:
                    plan.carbs,

                fat:
                    plan.fat,

                fiber:
                    plan.fiber

            });

            await saveNutritionTarget({

                calories:
                    plan.calories,

                protein:
                    plan.protein,

                carbs:
                    plan.carbs,

                fat:
                    plan.fat,

                fiber:
                    plan.fiber

            });

            alert(

                "Nutrition Target Saved"

            );

        }

        catch (error) {

            console.log(error);

            alert(

                "Unable To Save"

            );

        }

    };

    const consistencyWarning =
        getConsistencyWarning(plan);

    return (

<div className="container mt-4">

<h2 className="mb-4">

🥗 Nutrition Plan

</h2>

<div className="row">

{
consistencyWarning && (

<div className="col-12">

<div className="alert alert-warning">

Your current targets cannot make all meal planner bars reach 95% to 105%.
Protein, carbs, and fat equal about{" "}
<strong>{consistencyWarning.macroCalories} kcal</strong>,
but calories are set to{" "}
<strong>{plan.calories} kcal</strong>. Set calories near{" "}
<strong>{consistencyWarning.macroCalories} kcal</strong>,
or keep calories and change carbs near{" "}
<strong>{consistencyWarning.carbsNeeded}g</strong>
or fat near{" "}
<strong>{consistencyWarning.fatNeeded}g</strong>.

</div>

</div>

)
}

{

[
{
label:"Calories",
field:"calories",
step:100
},

{
label:"Protein",
field:"protein",
step:5
},

{
label:"Carbs",
field:"carbs",
step:10
},

{
label:"Fat",
field:"fat",
step:5
},

{
label:"Fiber",
field:"fiber",
step:2
}

].map(item=>(

<div

className="col-md-4 mb-3"

key={item.field}

>

<div className="card shadow">

<div className="card-body text-center">

<h6>

{item.label}

</h6>

<div className="d-flex justify-content-center align-items-center gap-3">

<button

className="btn btn-danger"

onClick={()=>updateValue(

item.field,

-item.step

)}

>

-

</button>

<h3 className="m-0">

{

plan[item.field]

}

</h3>

<button

className="btn btn-success"

onClick={()=>updateValue(

item.field,

item.step

)}

>

+

</button>

</div>

</div>

</div>

</div>

))

}

</div>

<div className="card shadow mt-4">

<div className="card-body">

<h4>

Vitamins & Minerals

</h4>

<hr/>

<p>

Vitamin A :
{plan.vitamin_a}

</p>

<p>

Vitamin C :
{plan.vitamin_c}

</p>

<p>

Vitamin D :
{plan.vitamin_d}

</p>

<p>

Vitamin B12 :
{plan.vitamin_b12}

</p>

<p>

Calcium :
{plan.calcium}

</p>

<p>

Iron :
{plan.iron}

</p>

<p>

Magnesium :
{plan.magnesium}

</p>

<p>

Potassium :
{plan.potassium}

</p>

<p>

Zinc :
{plan.zinc}

</p>

</div>

</div>
<div className="text-center mt-4 mb-5">

    <button

        className="btn btn-success btn-lg px-5"

        onClick={savePlan}

    >

        💾 Save Changes

    </button>

</div>

</div>

);

}

export default DietPlan;
