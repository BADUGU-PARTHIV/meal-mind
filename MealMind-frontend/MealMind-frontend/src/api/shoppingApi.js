import api from "./axios";

export const getShopping = async () => {
  return await api.get("/shoppinglist");
};


export const updateShopping = async (
  id,
  data
) => {

  return await api.put(
    `/shoppinglist/${id}`,
    data
  );

};

export const addShopping = async (
  data
) => {

  return await api.post(
    "/shoppinglist",
    data
  );

};

export const deleteShopping = async (
  id
) => {

  return await api.delete(
    `/shoppinglist/${id}`
  );

};