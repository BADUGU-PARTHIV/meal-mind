import api from "./axios";

export const getTodayMealPlan =
async () => {

    return await api.get(
        "/mealplan/today"
    );

};

export const regenerateMeal =
async (data) => {

    return await api.post(
        "/mealplan/regenerate",
        data
    );

};