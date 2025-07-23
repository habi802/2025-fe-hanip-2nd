import axios from "./httpRequester";

const path = '/review';

export const getReviewsByStoreId = id => {
    return axios.get(`${path}/store/${id}`).catch(e => e.response);
}