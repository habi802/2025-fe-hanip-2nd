import axios from "./httpRequester";

const path = "/review";

export const getReviewsByStoreId = (id) => {
  return axios.get(`${path}/store/${id}`).catch((e) => e.response);
};

export const patchOwnerComment = (reviewId, ownerComment) => {
  return axios.patch(
    "/review/owner",
    {
      reviewId,
      ownerComment,
    },
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
};
// 리뷰 작성
export const saveReview = (formData) => {
  const config = {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  };
  return axios.post( path, formData, config).catch((e) => e.response);
};

// 리뷰 수정
export const putReview = (formData) => {
  const config = {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  };
  return axios.put( path, formData, config).catch((e) => e.response);
};

//    오더 아이디에 따른 리뷰 조회
export const getReviewOne = (orderId) => {
  return axios.get(`${path}/${orderId}`).catch((e) => e.response);
};
