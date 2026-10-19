import api from "./axios";

export const getRecipes = async () => {
    return await api.get("/recipes");
};

export const createRecipe = async (data) => {
    return await api.post("/recipes", data);
};

export const getRecipeDetails = async (id) => {
    return await api.get(`/recipes/${id}`);
};

export const getRecipeIngredients = async (id) => {
    return await api.get(`/recipes/${id}/ingredients`);
};

export const getPantryStatus = async (id) => {
    return await api.get(`/recipes/${id}/pantry`);
};

export const getSimilarRecipes = async (id) => {
    return await api.get(`/recipes/${id}/similar`);
};
