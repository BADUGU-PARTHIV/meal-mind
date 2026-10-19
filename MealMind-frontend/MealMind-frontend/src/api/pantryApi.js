import api from "./axios";

export const getPantry = async () => {
  return await api.get("/pantry");
};

export const addPantry = async (data) => {
  return await api.post("/pantry", data);
};

export const updatePantry = async (id, data) => {
  return await api.put(`/pantry/${id}`, data);
};

export const adjustPantryQuantity = async (
  id,
  delta
) => {
  return await api.patch(
    `/pantry/${id}/quantity`,
    { delta }
  );
};

export const deletePantry = async (id) => {
  return await api.delete(`/pantry/${id}`);
};

export const getLowStock = async () => {
  return await api.get("/pantry/low-stock");
};

export const addMissingIngredients = async (data) => {
  return await api.post("/pantry/add-missing", data);
};
