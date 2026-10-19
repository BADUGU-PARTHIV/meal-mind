import api from "./axios";

export const getDashboard = async () => {

    return await api.get(
        "/dashboard/summary"
    );

};

export const getWeeklyCalories = async () => {

    return await api.get(
        "/dashboard/weekly-calories"
    );

};