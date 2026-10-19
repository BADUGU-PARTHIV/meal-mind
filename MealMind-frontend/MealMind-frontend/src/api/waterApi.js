import api from "./axios";

export const getWater =
async () => {

  return await api.get(
    "/water"
  );

};

export const addWater =
async (amount) => {

  return await api.post(
    "/water",
    {
      amount
    }
  );

};