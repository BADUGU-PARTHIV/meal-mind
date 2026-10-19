import api from "./axios";

export const getNutritionTarget = async () => {

    return await api.get(

        "/nutrition-target"

    );

};

export const saveNutritionTarget = async (

    data

) => {

    return await api.post(

        "/nutrition-target",

        data

    );

};