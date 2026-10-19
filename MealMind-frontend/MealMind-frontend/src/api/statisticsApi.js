import api from "./axios";

export const getStatistics = async (
    period,
    date
) => {
    return await api.get(
        "/statistics",
        {
            params: {
                period,
                date
            }
        }
    );
};
