import _FETCH from "@utils/_FETCH.ts";
import formatQueryParams from "@utils/formatQueryParams.ts";

const API_URL_PUBLIC = `${import.meta.env.VITE_PUBLIC_API_URL}/products`;
const API_URL = `${import.meta.env.VITE_PUBLIC_API_URL}/admin-products`;

export const get = async (id: number) => {
    return await _FETCH.request({url: `${API_URL_PUBLIC}/get?id=${id}`});
}

export const getAll = async (page: number, limit: number) => {
    return await _FETCH.request({url: `${API_URL_PUBLIC}/get-all?page=${page}&limit=${limit}`});
}

export const getCount = async (categoryTypeId?: number, brandId?: number)=> {
    const params = formatQueryParams({
        category_type_id: categoryTypeId,
        brand_id: brandId
    });

    return await _FETCH.request({url: `${API_URL_PUBLIC}/get-count${params ? `?${params}` : ''}`})
}

export const search = async (query: string) => {
    return await _FETCH.request({url: `${API_URL_PUBLIC}/search?query=${query}`});
}

export const deleteMany = async (ids: number[])=> {
    return await _FETCH.progressTrackingRequest({
        url: `${API_URL}/delete`,
        options: {
            method: "POST",
            body: JSON.stringify({ids})
        }
    });
}

export const update = async (data: FormData) => {
    return await _FETCH.progressTrackingRequest(({
        url: `${API_URL}/update`,
        options: {
            method: "POST",
            body: data
        }
    }))
}

export const add = async (data: FormData) => {
    return await _FETCH.progressTrackingRequest(({
        url: `${API_URL}/add`,
        options: {
            method: "POST",
            body: data
        }
    }))
}

export const oneWayPairVariations = async (data: {
    ids: number[];
    variations_ids: number[];
}) => {
    return await _FETCH.progressTrackingRequest({
        url: `${API_URL}/pair-variations`,
        options: {
            method: "POST",
            body: JSON.stringify({...data, one_way: true})
        }
    });
}

export const pairVariations = async (data: {
    ids: number[];
    variations_ids: number[];
}) => {
    return await _FETCH.progressTrackingRequest({
        url: `${API_URL}/pair-variations`,
        options: {
            method: "POST",
            body: JSON.stringify(data)
        }
    });
}

export const oneWayPairRelated = async (data: {
    ids: number[];
    related_ids: number[];
}) => {
    return await _FETCH.progressTrackingRequest({
        url: `${API_URL}/pair-related`,
        options: {
            method: "POST",
            body: JSON.stringify({...data, one_way: true})
        }
    });
}

export const pairRelated = async (data: {
    ids: number[];
    related_ids: number[];
}) => {
    return await _FETCH.progressTrackingRequest({
        url: `${API_URL}/pair-related`,
        options: {
            method: "POST",
            body: JSON.stringify(data)
        }
    });
}

export const makeHit = async (ids: number[]) => {
    return await changeHit(ids, true);

}

export const excludeHit = async (ids: number[]) => {
    return await changeHit(ids, false);
}

export const changeHit = async (ids: number[], status: boolean) => {
    return await _FETCH.request({
        url: `${API_URL}/${status ? 'make-hit' : 'exclude-hit'}`,
        options: {
            method: "POST",
            body: JSON.stringify({ids})
        },
        toastSuccess: true
    });
}
