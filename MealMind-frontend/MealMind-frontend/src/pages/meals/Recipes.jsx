import {
    useEffect,
    useMemo,
    useState
} from "react";
import {
    Link
} from "react-router-dom";
import {
    createRecipe,
    getRecipes
} from "../../api/recipeApi";
import {
    getImageUrl
} from "../../utils/imageUrl";

const emptyRecipe = {
    name: "",
    category: "Breakfast",
    diet_type: "Veg",
    description: "",
    instructions: "",
    calories: "",
    protein: "",
    carbs: "",
    fat: "",
    fiber: "",
    cooking_time: 20,
    tags: "",
    image_data: "",
    ingredients: [
        {
            name: "",
            quantity_g: ""
        }
    ]
};

function Recipes() {
    const [recipes, setRecipes] = useState([]);
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("All");
    const [dietFilter, setDietFilter] = useState("All");
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [showAddRecipe, setShowAddRecipe] = useState(false);
    const [newRecipe, setNewRecipe] = useState(emptyRecipe);
    const [error, setError] = useState("");

    const loadRecipes = async () => {
        try {
            setError("");
            const response = await getRecipes();
            setRecipes(response.data);
        }
        catch (requestError) {
            console.log(requestError);
            setError(
                requestError.response?.data?.message ||
                "Unable to load recipes."
            );
        }
        finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        loadRecipes();
    }, []);

    const categories = useMemo(
        () => [
            "All",
            ...new Set(
                recipes
                    .map(recipe => recipe.category)
                    .filter(Boolean)
            )
        ],
        [recipes]
    );

    const visibleRecipes = recipes.filter(recipe => {
        const recipeDiet =
            String(recipe.diet_type || "")
                .toLowerCase()
                .replace("-", " ");
        const selectedDiet =
            dietFilter
                .toLowerCase()
                .replace("-", " ");
        const matchesSearch = [
            recipe.name,
            recipe.description,
            recipe.tags
        ]
            .filter(Boolean)
            .join(" ")
            .toLowerCase()
            .includes(search.toLowerCase());
        const matchesCategory =
            category === "All" ||
            recipe.category === category;
        const matchesDiet =
            dietFilter === "All" ||
            (
                selectedDiet === "veg"
                    ? recipeDiet === "veg" ||
                        recipeDiet === "vegetarian" ||
                        recipeDiet === "vegan"
                    : recipeDiet === selectedDiet
            );

        return matchesSearch && matchesCategory && matchesDiet;
    });

    const handleRecipeChange = (
        field,
        value
    ) => {
        setNewRecipe(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleIngredientChange = (
        index,
        field,
        value
    ) => {
        setNewRecipe(prev => ({
            ...prev,
            ingredients: prev.ingredients.map(
                (ingredient, ingredientIndex) =>
                    ingredientIndex === index
                        ? {
                            ...ingredient,
                            [field]: value
                        }
                        : ingredient
            )
        }));
    };

    const addIngredientRow = () => {
        setNewRecipe(prev => ({
            ...prev,
            ingredients: [
                ...prev.ingredients,
                {
                    name: "",
                    quantity_g: ""
                }
            ]
        }));
    };

    const handleImage = (event) => {
        const file =
            event.target.files?.[0];

        if (!file) return;

        const reader =
            new FileReader();

        reader.onload = () => {
            handleRecipeChange(
                "image_data",
                reader.result
            );
        };

        reader.readAsDataURL(file);
    };

    const saveOwnRecipe = async () => {
        try {
            setSaving(true);

            await createRecipe({
                ...newRecipe,
                calories: Number(newRecipe.calories || 0),
                protein: Number(newRecipe.protein || 0),
                carbs: Number(newRecipe.carbs || 0),
                fat: Number(newRecipe.fat || 0),
                fiber: Number(newRecipe.fiber || 0),
                cooking_time: Number(newRecipe.cooking_time || 20),
                ingredients: newRecipe.ingredients.filter(
                    ingredient =>
                        ingredient.name &&
                        Number(ingredient.quantity_g) > 0
                )
            });

            alert("Your recipe was added successfully.");
            setNewRecipe(emptyRecipe);
            setShowAddRecipe(false);
            await loadRecipes();
        }
        catch (requestError) {
            console.log(requestError);
            alert(
                requestError.response?.data?.message ||
                "Unable to save recipe."
            );
        }
        finally {
            setSaving(false);
        }
    };

    return (
        <div className="container-fluid">
            <div className="d-flex justify-content-between align-items-start mb-4">
                <div>
                    <h2 className="fw-bold mb-1">
                        Recipe Library
                    </h2>
                    <p className="text-muted">
                        Browse recipes by diet type or add your own recipe.
                    </p>
                </div>
                <button
                    className="btn btn-success"
                    onClick={() => setShowAddRecipe(prev => !prev)}
                >
                    {showAddRecipe ? "Close" : "➕ Add Own Recipe"}
                </button>
            </div>

            {showAddRecipe && (
                <div className="card shadow-sm border-0 mb-4">
                    <div className="card-body">
                        <h4>Add Your Own Recipe</h4>

                        <div className="row g-3">
                            <div className="col-md-4">
                                <input
                                    className="form-control"
                                    placeholder="Recipe name"
                                    value={newRecipe.name}
                                    onChange={(event) =>
                                        handleRecipeChange("name", event.target.value)
                                    }
                                />
                            </div>
                            <div className="col-md-4">
                                <select
                                    className="form-select"
                                    value={newRecipe.category}
                                    onChange={(event) =>
                                        handleRecipeChange("category", event.target.value)
                                    }
                                >
                                    <option>Breakfast</option>
                                    <option>Lunch</option>
                                    <option>Snack</option>
                                    <option>Dinner</option>
                                </select>
                            </div>
                            <div className="col-md-4">
                                <select
                                    className="form-select"
                                    value={newRecipe.diet_type}
                                    onChange={(event) =>
                                        handleRecipeChange("diet_type", event.target.value)
                                    }
                                >
                                    <option>Veg</option>
                                    <option>Non-Veg</option>
                                    <option>Vegan</option>
                                </select>
                            </div>

                            <div className="col-md-6">
                                <textarea
                                    className="form-control"
                                    placeholder="Short description"
                                    value={newRecipe.description}
                                    onChange={(event) =>
                                        handleRecipeChange("description", event.target.value)
                                    }
                                />
                            </div>
                            <div className="col-md-6">
                                <textarea
                                    className="form-control"
                                    placeholder="Instructions"
                                    value={newRecipe.instructions}
                                    onChange={(event) =>
                                        handleRecipeChange("instructions", event.target.value)
                                    }
                                />
                            </div>

                            {["calories", "protein", "carbs", "fat", "fiber"].map(field => (
                                <div
                                    className="col-md"
                                    key={field}
                                >
                                    <input
                                        type="number"
                                        className="form-control"
                                        placeholder={field}
                                        value={newRecipe[field]}
                                        onChange={(event) =>
                                            handleRecipeChange(field, event.target.value)
                                        }
                                    />
                                </div>
                            ))}

                            <div className="col-md-4">
                                <input
                                    type="number"
                                    className="form-control"
                                    placeholder="Cooking time"
                                    value={newRecipe.cooking_time}
                                    onChange={(event) =>
                                        handleRecipeChange("cooking_time", event.target.value)
                                    }
                                />
                            </div>
                            <div className="col-md-4">
                                <input
                                    className="form-control"
                                    placeholder="Tags"
                                    value={newRecipe.tags}
                                    onChange={(event) =>
                                        handleRecipeChange("tags", event.target.value)
                                    }
                                />
                            </div>
                            <div className="col-md-4">
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="form-control"
                                    onChange={handleImage}
                                />
                            </div>
                        </div>

                        <h5 className="mt-4">Ingredients</h5>
                        {newRecipe.ingredients.map((ingredient, index) => (
                            <div
                                className="row g-2 mb-2"
                                key={index}
                            >
                                <div className="col-md-8">
                                    <input
                                        className="form-control"
                                        placeholder="Ingredient name"
                                        value={ingredient.name}
                                        onChange={(event) =>
                                            handleIngredientChange(index, "name", event.target.value)
                                        }
                                    />
                                </div>
                                <div className="col-md-4">
                                    <input
                                        type="number"
                                        className="form-control"
                                        placeholder="Quantity in grams"
                                        value={ingredient.quantity_g}
                                        onChange={(event) =>
                                            handleIngredientChange(index, "quantity_g", event.target.value)
                                        }
                                    />
                                </div>
                            </div>
                        ))}

                        <div className="d-flex gap-2 mt-3">
                            <button
                                className="btn btn-outline-secondary"
                                onClick={addIngredientRow}
                            >
                                Add Ingredient
                            </button>
                            <button
                                className="btn btn-success"
                                onClick={saveOwnRecipe}
                                disabled={saving}
                            >
                                {saving ? "Saving..." : "Save Recipe"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="row g-2 mb-4">
                <div className="col-md-5">
                    <input
                        className="form-control"
                        placeholder="Search recipes or tags..."
                        value={search}
                        onChange={(event) =>
                            setSearch(event.target.value)
                        }
                    />
                </div>
                <div className="col-md-3">
                    <select
                        className="form-select"
                        value={category}
                        onChange={(event) =>
                            setCategory(event.target.value)
                        }
                    >
                        {categories.map(item => (
                            <option key={item}>{item}</option>
                        ))}
                    </select>
                </div>
                <div className="col-md-4">
                    <select
                        className="form-select"
                        value={dietFilter}
                        onChange={(event) =>
                            setDietFilter(event.target.value)
                        }
                    >
                        <option>All</option>
                        <option>Veg</option>
                        <option>Non-Veg</option>
                        <option>Vegan</option>
                    </select>
                </div>
            </div>

            {error && (
                <div className="alert alert-danger">
                    {error}
                </div>
            )}

            {loading ? (
                <div className="text-center py-5">
                    Loading recipes...
                </div>
            ) : (
                <div className="row g-4">
                    {visibleRecipes.map(recipe => (
                        <div
                            className="col-sm-6 col-xl-4"
                            key={recipe.id}
                        >
                            <div className="card shadow-sm border-0 h-100">
                                {recipe.image_url ? (
                                    <img
                                        src={getImageUrl(recipe.image_url)}
                                        alt={recipe.name}
                                        className="card-img-top"
                                        style={{
                                            height: "210px",
                                            objectFit: "cover"
                                        }}
                                    />
                                ) : (
                                    <div
                                        className="d-flex align-items-center justify-content-center text-white"
                                        style={{
                                            height: "210px",
                                            background:
                                                "linear-gradient(135deg,#16a34a,#166534)"
                                        }}
                                    >
                                        <h4>{recipe.category}</h4>
                                    </div>
                                )}

                                <div className="card-body d-flex flex-column">
                                    <div className="d-flex justify-content-between gap-2">
                                        <h4>{recipe.name}</h4>
                                        <div>
                                            {recipe.is_custom ? (
                                                <span className="badge bg-dark me-1">
                                                    Mine
                                                </span>
                                            ) : null}
                                            <span className="badge bg-success align-self-start">
                                                {recipe.diet_type || "All"}
                                            </span>
                                            {recipe.allergy_warnings?.length > 0 ? (
                                                <span className="badge bg-danger mt-1 d-block">
                                                    ⚠ Allergy
                                                </span>
                                            ) : null}
                                        </div>
                                    </div>
                                    <p className="text-muted flex-grow-1">
                                        {recipe.description}
                                    </p>
                                    <div className="d-flex justify-content-between mb-3">
                                        <span>🔥 {recipe.calories} kcal</span>
                                        <span>💪 {recipe.protein} g</span>
                                    </div>
                                    <Link
                                        to={`/recipe/${recipe.id}`}
                                        className="btn btn-outline-success"
                                    >
                                        View Recipe
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}

                    {visibleRecipes.length === 0 && (
                        <div className="col-12">
                            <div className="alert alert-info">
                                No recipes match your filters.
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default Recipes;
