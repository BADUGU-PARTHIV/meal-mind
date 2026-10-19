import api from "./axios";

export const transferToPantry = async () => {

  return await api.post(
    "/shoppinglist/transfer"
  );

};