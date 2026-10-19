import api from "./axios";

export const getNutritionPlan =
async () => {

  return await api.get(
    "/nutrition-plan"
  );

};

export const updateNutritionPlan =
async (data) => {

  return await api.put(
    "/nutrition-plan",
    data
  );

};