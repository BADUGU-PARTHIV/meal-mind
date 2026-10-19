import api from "./axios";

export const getMeals = async () => {

  return await api.get(
    "/mealplan"
  );

};

export const getRecipe = async (
  id
) => {

  return await api.get(
    `/meals/${id}`
  );

};

export const addMeal = async (
  data
) => {

  return await api.post(
    "/mealplan",
    data
  );

};

export const deleteMeal = async (
  id
) => {

  return await api.delete(
    `/mealplan/${id}`
  );

};
