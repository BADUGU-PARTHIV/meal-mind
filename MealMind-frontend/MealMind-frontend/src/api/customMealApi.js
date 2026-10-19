import api from "./axios";

export const saveCustomMeal = async (data) => {

    return await api.post(

        "/food/custom-meal",

        data

    );

};