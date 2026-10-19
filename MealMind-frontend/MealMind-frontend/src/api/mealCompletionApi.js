import api from "./axios";

export const completeMeal = async (mealData) => {

  return await api.post(
    "/foodlog",
    mealData
  );

};

export const uncompleteMeal = async (
  foodLogId,
  recipeId,
  servingMultiplier = 1
) => {
  return await api.delete(
    `/foodlog/${foodLogId}/completion`,
    {
      params: {
        recipe_id: recipeId,
        serving_multiplier: servingMultiplier
      }
    }
  );
};
