import api from "./axios";

export const generateMonthlyPlan =
async () => {

  return await api.post(
    "/monthly-meal-plan/generate"
  );

};