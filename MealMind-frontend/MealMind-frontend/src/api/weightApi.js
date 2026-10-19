import api from "./axios";

export const getWeights = async () => {
  return await api.get("/weights");
};

export const addWeight = async (data) => {
  return await api.post("/weights", data);
};