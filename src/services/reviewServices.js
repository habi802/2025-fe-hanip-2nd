import axios from "./httpRequester";

const path = '/review';


// 리뷰 저장하기
export const saveReview = (reviewData) => {
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };
    return axios.post(path, reviewData, config).catch((e) => e.response);
  };

// 리뷰 조회하기
export const getReviewsByStoreId = id => {
    return axios.get(`${path}/store/${id}`).catch(e => e.response);
}

// 리뷰 수정하기는 고려사항

// 리뷰 삭제하기
export const removeReview = reviewId => {
    return axios.delete(`${path}/${reviewId}`)
}

