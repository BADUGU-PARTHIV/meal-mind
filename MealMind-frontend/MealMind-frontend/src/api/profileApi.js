import api from "./axios";

export const getProfile = async () => {
  return await api.get("/users/profile");
};

export const updateProfile = async (data) => {
  return await api.put("/users/profile", data);
};

export const resetProfile = async () => {
  return await api.put("/users/profile/reset");
};
