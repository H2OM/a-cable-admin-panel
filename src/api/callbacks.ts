import _FETCH from "@utils/_FETCH.ts";
import formatQueryParams from "@utils/formatQueryParams.ts";

const API_URL = `${import.meta.env.VITE_PUBLIC_API_URL}/admin-callbacks`;

export const getAll = async (page: number, limit: number) => {
    return await _FETCH.request({url: `${API_URL}/get-all?page=${page}&limit=${limit}`});
}

export const getCount = async (userId?: number) => {
    const params = formatQueryParams({
        user_id: userId
    });

    return await _FETCH.request({url: `${API_URL}/get-count${params ? `?${params}` : ''}`})
}

export const deleteMany = async (ids: number[]) => {
    return await _FETCH.progressTrackingRequest({
        url: `${API_URL}/delete`,
        options: {
            method: "POST",
            body: JSON.stringify({ids})
        }
    });
}