import axios from "./httpRequester";

const path = '/review';

export const getReviewsByStoreId = id => {
    return axios.get(`${path}/store/${id}`).catch(e => e.response);
}

export const patchOwnerComment = (reviewId, ownerComment) => {
    return axios.patch(
        "/review/owner",
        {
            reviewId,
            ownerComment
        },
        {
            headers: {
                "Content-Type": "application/json"
        }});};

