import { useEffect, useState } from "react";
import { useParams,Link} from "react-router-dom";
import {
    getRecipeDetails,
    getRecipeIngredients,
    getPantryStatus,
    getSimilarRecipes
} from "../../api/recipeApi";
import {
    completeMeal,
    uncompleteMeal
} from "../../api/mealCompletionApi";
import {
    addFavorite,
    deleteFavoriteByRecipe,
    getFavoriteStatus
} from "../../api/favoriteApi";
import { addMissingIngredients } from "../../api/pantryApi";
import {
    getProfile
} from "../../api/profileApi";
import RecipeNutrition from "../../components/meal/RecipeNutrition";
import LogMealModal from "../../components/modals/LogMealModal";
import MealCompletedModal from "../../components/modals/MealCompletedModal";
import {
    getImageUrl
} from "../../utils/imageUrl";

const allergyMap = {
    milk: [
        "milk",
        "paneer",
        "cheese",
        "curd",
        "butter",
        "ghee",
        "greek yogurt",
        "yogurt"
    ],
    egg: ["egg"],
    fish: ["fish"],
    peanut: ["peanut"]
};

const getAllergyTargets = (allergy) =>
    String(allergy || "")
        .split(",")
        .map(item => item.trim().toLowerCase())
        .filter(Boolean)
        .flatMap(item => allergyMap[item] || [item]);

const getIngredientAllergyWarnings = (
    ingredients,
    allergy
) => {
    const targets =
        getAllergyTargets(allergy);

    if (!targets.length) {
        return [];
    }

    const matched =
        ingredients
            .map(item => item.name)
            .filter(Boolean)
            .filter(name => {
                const ingredientName =
                    name.toLowerCase();

                return targets.some(target =>
                    ingredientName === target ||
                    ingredientName.includes(target) ||
                    target.includes(ingredientName)
                );
            });

    return [...new Set(matched)];
};

function RecipeDetails() {
    const { id } = useParams();
    const [recipe, setRecipe] =
        useState(null);
    const [pantry, setPantry] =
        useState(null);
    const [error, setError] =
        useState("");
    const [showModal, setShowModal] =
        useState(false);
    const [showCustomMeal, setShowCustomMeal] =
        useState(false);
    const [completedLogId, setCompletedLogId] =
        useState(null);
    const [customMealCompleted, setCustomMealCompleted] =
        useState(false);
    const [updatingCompletion, setUpdatingCompletion] =
        useState(false);
    const [similar, setSimilar] =
        useState([]);
    const [isFavorite, setIsFavorite] =
        useState(false);
    useEffect(() => {
        loadRecipe();
        // The recipe loader intentionally runs whenever the route id changes.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);
    async function loadRecipe() {

            try {

                setError("");
                
                const recipeResponse =
                    await getRecipeDetails(id);

                const ingredientResponse =
                    await getRecipeIngredients(id);

                const pantryResponse =
                    await getPantryStatus(id);
                const favoriteResponse =
                    await getFavoriteStatus(id);
                const profileResponse =
                    await getProfile();

                const allergyWarnings =
                    recipeResponse.data.allergy_warnings?.length > 0
                        ? recipeResponse.data.allergy_warnings
                        : getIngredientAllergyWarnings(
                            ingredientResponse.data,
                            profileResponse.data.allergy
                        );

                setRecipe({

                    ...recipeResponse.data,

                    allergy_warnings:
                        allergyWarnings,

                    ingredients:
                        ingredientResponse.data

                });

                setCompletedLogId(null);
                setCustomMealCompleted(false);
                setIsFavorite(
                    favoriteResponse.data.isFavorite
                );

                setPantry(
                    pantryResponse.data
                );
                const similarResponse =
await getSimilarRecipes(id);

setSimilar(
    similarResponse.data
);
            }

            catch (error) {

                console.log(error);

                setError(

                    error.response?.data?.message ||

                    "Unable To Load Recipe"

                );

            }

        }

    const handleCompleteMeal =
        async () => {

            try {

                setUpdatingCompletion(true);

                if (completedLogId) {

                    await uncompleteMeal(
                        completedLogId,
                        recipe.id
                    );

                    setCompletedLogId(null);
                    return;

                }

                const mealContext = window.confirm(
                    "Do you want to add this as part of your routine meal plan? Press OK for routine, or Cancel for extra meal."
                )
                    ? "routine"
                    : "extra";

                const response = await completeMeal({

                    recipe_id:
                        recipe.id,

                    food_name:
                        recipe.name,

                    quantity: 1,

                    calories:
                        recipe.calories,

                    protein:
                        recipe.protein,

                    carbs:
                        recipe.carbs,

                    fat:
                        recipe.fat,

                    fiber:
                        recipe.fiber,

                    meal_context:
                        mealContext

                });

                setCompletedLogId(
                    response.data.food_log_id
                );

                setShowModal(true);

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

    const toggleFavorite =
        async () => {

            try {

                if (isFavorite) {

                    await deleteFavoriteByRecipe(
                        recipe.id
                    );

                    setIsFavorite(false);

                    return;

                }

                await addFavorite({

                    recipe_id:
                        recipe.id,

                    recipe_name:
                        recipe.name,

                    recipe_image:
                        recipe.image_url

                });

                setIsFavorite(true);

            }

            catch (error) {

                console.log(error);

            }

        };

    const handleAddMissing =
        async () => {

            try {

                await addMissingIngredients({

                    ingredients:
                        pantry.missing

                });

                alert(

                    "Ingredients Added To Shopping List"

                );

            }

            catch (error) {

                console.log(error);

            }

        };

    const handleShare = () => {

        if (navigator.share) {

            navigator.share({

                title:
                    recipe.name,

                text:
                    recipe.description,

                url:
                    window.location.href

            });

        }

        else {

            alert(

                "Sharing Not Supported"

            );

        }

    };

    if (error) {

        return (

            <div className="alert alert-danger text-center mt-5">

                <h4>

                    {error}

                </h4>

                <button

                    className="btn btn-danger mt-3"

                    onClick={loadRecipe}

                >

                    Retry

                </button>

            </div>

        );

    }

    if (!recipe) {

        return (

            <div className="text-center mt-5">

                <h2>

                    Loading Recipe...

                </h2>

            </div>

        );

    }

    return (
      <div className="container mt-4">

    <div className="row">

        <div className="col-lg-8">

            <div
                className="card shadow border-0"
                style={{
                    borderRadius: "20px",
                    overflow: "hidden",
                    position: "relative"
                }}
            >

                {(completedLogId || customMealCompleted) && (
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

                {

                    recipe.image_url ?

                    <img

                        src={getImageUrl(recipe.image_url)}

                        alt={recipe.name}

                        className="card-img-top"

                        style={{

                            height: "350px",

                            objectFit: "cover"

                        }}

                    />

                    :

                    <div

                        className="d-flex justify-content-center align-items-center text-white"

                        style={{

                            height: "300px",

                            background:
                            "linear-gradient(135deg,#16a34a,#15803d)"

                        }}

                    >

                        <h2>

                            {recipe.category}

                        </h2>

                    </div>

                }

                <div className="card-body">

                    <div className="d-flex justify-content-between align-items-start flex-wrap">

                        <div>

                            <h2 className="fw-bold">

                                {recipe.name}

                            </h2>

                            <p className="text-muted">

                                {recipe.description}

                            </p>

                        </div>

                        <span className="badge bg-success">

                            Healthy Choice

                        </span>

                    </div>

                    <div className="d-flex flex-wrap gap-2 mb-4">

                        <span className="badge bg-primary">

                            ⏱ {recipe.cooking_time} mins

                        </span>

                        <span className="badge bg-warning text-dark">

                            👨‍🍳 {recipe.difficulty}

                        </span>

                        <span className="badge bg-success">

                            ⭐ {recipe.rating}

                        </span>

                        {

                            recipe.tags &&

                            recipe.tags

                            .split(",")

                            .map(tag=>(

                                <span

                                    key={tag}

                                    className="badge bg-info text-dark"

                                >

                                    🥗 {tag.trim()}

                                </span>

                            ))

                        }

                    </div>

                    {
                        recipe.allergy_warnings?.length > 0 &&

                        <div className="alert alert-danger">

                            🚨 This recipe contains{" "}
                            <strong>
                                {recipe.allergy_warnings.join(", ")}
                            </strong>
                            {" "}which may be allergic for you.

                        </div>

                    }

                    {

                        pantry &&

                        (

                            pantry.missing.length===0 ?

                            <div className="alert alert-success">

                                🟢 All Ingredients Available

                            </div>

                            :

                            <div className="alert alert-warning">

                                🟡 Missing

                                {" "}

                                {pantry.missing.length}

                                {" "}

                                Ingredient(s)

                            </div>

                        )

                    }

                    {

                        pantry?.missing.length>0 &&

                        <div className="mb-3">

                            {

                                pantry.missing.map(item=>(

                                    <span

                                        key={item.name}

                                        className="badge bg-danger me-2 mb-2"

                                    >

                                        {item.name}

                                    </span>

                                ))

                            }

                            <br/>

                            <button

                                className="btn btn-warning mt-3"

                                onClick={handleAddMissing}

                            >

                                🛒 Add Missing Ingredients

                            </button>

                        </div>

                    }

                    <div
                        className="d-flex gap-2 flex-wrap mb-4"
                        style={{
                            position: "relative",
                            zIndex: 3
                        }}
                    >

                        <button

                            className="btn btn-outline-warning"

                            onClick={toggleFavorite}

                        >

                            {
                                isFavorite
                                    ? "💛 Favorited"
                                    : "❤️ Favorite"
                            }

                        </button>

                        <button

                            className={
                                completedLogId
                                    ? "btn btn-light"
                                    : "btn btn-success"
                            }

                            onClick={handleCompleteMeal}
                            disabled={updatingCompletion}

                        >

                            {
                                updatingCompletion
                                    ? "Updating..."
                                    : completedLogId
                                        ? "✅ Completed"
                                        : "✅ Complete Meal"
                            }

                        </button>

                        <button
                            className="btn btn-outline-primary"
                            onClick={() => setShowCustomMeal(true)}
                        >

                            🍽 Log My Meal

                        </button>

                        <button

                            className="btn btn-secondary"

                            onClick={()=>window.print()}

                        >

                            🖨 Print

                        </button>

                        <button

                            className="btn btn-primary"

                            onClick={handleShare}

                        >

                            📤 Share

                        </button>

                    </div>

                    <hr/>

                    <h4 className="fw-bold mb-3">

                        🛒 Ingredients

                    </h4>

                    <div className="row">

                        {

                            recipe.ingredients?.map(

                                (ingredient,index)=>(

                                    <div

                                        className="col-md-6 mb-3"

                                        key={index}

                                    >

                                        <div className="card bg-light border-0">

                                            <div className="card-body">

                                                <strong>

                                                    {ingredient.name}

                                                </strong>

                                                <br/>

                                                <small>

                                                    {ingredient.quantity_g} g

                                                </small>

                                            </div>

                                        </div>

                                    </div>

                                )

                            )

                        }

                    </div>

                    <hr/>

                    <h4 className="fw-bold mb-3">

                        👨‍🍳 Instructions

                    </h4>

                    <div className="bg-light rounded p-4">

                        {recipe.instructions}

                    </div>

                </div>

            </div>

        </div>
        <hr />

<h4 className="fw-bold mb-3">

You May Also Like

</h4>

<div className="row">

{

similar.map(item => (

<div
className="col-md-3 mb-3"
key={item.id}
>

<Link
to={`/recipe/${item.id}`}
className="text-decoration-none"
>

<div className="card h-100 shadow-sm">

<img
src={getImageUrl(item.image_url)}
className="card-img-top"
style={{
height:"150px",
objectFit:"cover"
}}
/>

<div className="card-body">

<h6>

{item.name}

</h6>

<small>

🔥 {item.calories} kcal

</small>

<br/>

<small>

💪 {item.protein} g Protein

</small>

</div>

</div>

</Link>

</div>

))

}

</div>
                <div className="col-lg-4">

            <RecipeNutrition

                nutrition={recipe}

            />

        </div>

    </div>
    <LogMealModal
        show={showCustomMeal}
        onClose={() => setShowCustomMeal(false)}
        onSaved={() => {
            setCustomMealCompleted(true);
            setShowModal(true);
        }}
        onEntriesChanged={(savedFoods) =>
            setCustomMealCompleted(
                savedFoods.length > 0
            )
        }
    />

    <MealCompletedModal
        show={showModal}
        onClose={() => setShowModal(false)}
    />

</div>

    );

}

export default RecipeDetails;
