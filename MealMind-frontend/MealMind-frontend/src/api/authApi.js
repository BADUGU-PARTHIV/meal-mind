import api from "./axios";

export const registerUser =
async (data) => {

  return await api.post(
    "/users/register",
    data
  );

};

export const loginUser =
async (data) => {

  return await api.post(
    "/users/login",
    data
  );

};

export const getProfile =
async (token) => {

  return await api.get(
    "/users/profile",
    {
      headers: {
        Authorization:
          `Bearer ${token}`
      }
    }
  );

};