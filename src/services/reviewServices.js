import axios from "./httpRequester";

const path = '/review';

// 리뷰 불러오기
export const getReviewsByStoreId = id => {
    return axios.get(`${path}/store/${id}`).catch(e => e.response);
}

// 사장 답글 등록 (PATCH /reviews/owner)
export const patchOwnerComment = (reviewId, ownerComment) => {
  return axios.patch('/reviews/owner', {
    reviewId,
    ownerComment
  });
};