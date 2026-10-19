import { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { saveCustomMeal } from "../../api/customMealApi";
import { deleteFoodLog } from "../../api/foodLogApi";

const getCustomMealStorageKey = (consumedDate) => {
    const now = new Date();
    const localDate = consumedDate || new Date(
            now.getTime() - now.getTimezoneOffset() * 60000
        )
            .toISOString()
            .split("T")[0];

    return `mealmind_custom_meals_${localDate}`;
};

const getSavedFoods = (consumedDate) => {
    try {
        return JSON.parse(
            localStorage.getItem(
                getCustomMealStorageKey(consumedDate)
            )
        ) || [];
    }
    catch {
        return [];
    }
};

const emptyFood = () => ({
    food_name: "",
    quantity: ""
});

function LogMealModal({
    show,
    onClose,
    onSaved,
    onEntriesChanged,
    consumedDate
}) {

    const [mealType, setMealType] = useState("Breakfast");
    const [saving, setSaving] = useState(false);

    const [foods, setFoods] = useState(() => {
        const savedFoods = getSavedFoods(consumedDate);
        return savedFoods.length
            ? savedFoods
            : [emptyFood()];
    });
    const addFood = () => {

    setFoods([

        ...foods,

        emptyFood()

    ]);

};

const updateFood = (

    index,

    field,

    value

) => {

    const updated = [...foods];

    updated[index][field] = value;

    setFoods(updated);

};

const removeFood = async (index) => {

    const food = foods[index];

    try {

        if (food.id) {
            await deleteFoodLog(food.id);
        }

        const updated = foods.filter(
            (_, i) => i !== index
        );
        const nextFoods = updated.length
            ? updated
            : [emptyFood()];
        const savedFoods = nextFoods.filter(
            item => item.id
        );

        setFoods(nextFoods);

        localStorage.setItem(
            getCustomMealStorageKey(consumedDate),
            JSON.stringify(savedFoods)
        );

        onEntriesChanged?.(savedFoods);

    }

    catch (error) {
        console.log(error);
        alert(
            error.response?.data?.message ||
            "Unable to delete this food item."
        );
    }

};

const handleSave = async () => {

    const newFoods = foods.filter(
        food => !food.id
    );

    if (newFoods.length === 0) {
        alert(
            "Your meal is already saved. Add another item or close this window."
        );
        return;
    }

    const hasInvalidFood = newFoods.some(
        food =>
            !food.food_name.trim() ||
            !food.quantity ||
            Number(food.quantity) <= 0
    );

    if (hasInvalidFood) {
        alert(
            "Please enter a food name and a valid quantity for every item."
        );
        return;
    }

    const shouldSave = window.confirm(
        "Before saving, please make sure you have added everything you ate in this meal. Would you like to continue?"
    );

    if (!shouldSave) return;

    try {

        setSaving(true);

        const response = await saveCustomMeal({

            meal_type: mealType,

            foods: newFoods,

            consumed_date: consumedDate

        });

        const existingFoods = foods.filter(
            food => food.id
        );
        const savedFoods = [
            ...existingFoods,
            ...response.data.foods
        ];

        setFoods(savedFoods);

        localStorage.setItem(
            getCustomMealStorageKey(consumedDate),
            JSON.stringify(savedFoods)
        );

        onClose();

        onSaved?.(savedFoods);

    }

    catch (error) {

        console.log(error);

        alert(

            error.response?.data?.message ||

            "Unable To Save Meal"

        );

    }

    finally {
        setSaving(false);
    }

};

    return (

        <Modal
            show={show}
            onHide={onClose}
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title>
                    🍽 Log My Meal
                    {consumedDate && ` — ${consumedDate}`}
                </Modal.Title>
            </Modal.Header>

            <Modal.Body>

<Form.Group className="mb-3">

<Form.Label>

Meal Type

</Form.Label>

<Form.Select

value={mealType}

onChange={(e)=>

setMealType(

e.target.value

)

}

>

<option>

Breakfast

</option>

<option>

Lunch

</option>

<option>

Dinner

</option>

<option>

Snack

</option>

</Form.Select>

</Form.Group>

<hr/>

{

foods.map(

(food,index)=>(

<div

key={index}

className="border rounded p-3 mb-3"

>

<div className="row">

<div className="col-md-6">

<Form.Label>

Food Name

</Form.Label>

<Form.Control

type="text"

placeholder="Rice"

value={food.food_name}
disabled={Boolean(food.id)}

onChange={(e)=>

updateFood(

index,

"food_name",

e.target.value

)

}

/>

</div>

<div className="col-md-4">

<Form.Label>

Quantity (g)

</Form.Label>

<Form.Control

type="number"

placeholder="100"

value={food.quantity}
disabled={Boolean(food.id)}

onChange={(e)=>

updateFood(

index,

"quantity",

e.target.value

)

}

/>

</div>

<div

className="col-md-2 d-flex align-items-end"

>

<button

type="button"

className="btn btn-danger w-100"

onClick={()=>

removeFood(

index

)

}

>

🗑

</button>

</div>

</div>

</div>

)

)

}

<div className="text-center">

<button

type="button"

className="btn btn-outline-success"

onClick={addFood}

>

➕ Add

</button>

</div>

            </Modal.Body>

            <Modal.Footer>
                <Button
                    variant="secondary"
                    onClick={onClose}
                >
                    Close
                </Button>

                <Button
                    variant="success"
                    onClick={handleSave}
                    disabled={saving}
                >
                    {saving ? "Saving..." : "Save Meal"}
                </Button>
            </Modal.Footer>
        </Modal>
    );

}

export default LogMealModal;
