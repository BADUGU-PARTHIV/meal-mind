import api from "./axios";

export const getFavorites =
async () => {

  return await api.get(
    "/favorites"
  );

};

export const addFavorite =
async (data) => {

  return await api.post(
    "/favorites",
    data
  );

};

export const deleteFavorite =
async (id) => {

  return await api.delete(
    `/favorites/${id}`
  );

};

export const getFavoriteStatus =
async (recipeId) => {

  return await api.get(
    `/favorites/recipe/${recipeId}`
  );

};

export const deleteFavoriteByRecipe =
async (recipeId) => {

  return await api.delete(
    `/favorites/recipe/${recipeId}`
  );

};
