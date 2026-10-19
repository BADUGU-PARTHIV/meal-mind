import api from "./axios";

export const getFoodLogs = async () => {
  return await api.get("/foodlog");
};

export const addFoodLog = async (data) => {
  return await api.post(
    "/foodlog",
    data
  );
};

export const updateFoodLog = async (
  id,
  data
) => {
  return await api.put(
    `/foodlog/${id}`,
    data
  );
};

export const deleteFoodLog = async (
  id
) => {
  return await api.delete(
    `/foodlog/${id}`
  );
};

export const resetTodayFoodLogs = async () => {
  return await api.delete(
    "/foodlog/today"
  );
};
