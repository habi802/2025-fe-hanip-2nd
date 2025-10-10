import axios from "./httpRequester";

const path = "/review";

// 가게 리뷰 점수만 조회
export const getReviewScoreByStoreId = (id,params) => {
  return axios.get(`${path}/store-review/${id}`,{params}).catch((e) => e.response);
};

// 가게 모든 리뷰 조회 (페이지네이션 O)
export const getReviewsByStoreId = (id,params) => {
  return axios.get(`${path}/store-review/all/${id}`,{params}).catch((e) => e.response);
};

// // 가게 모든 리뷰 + 사장코멘트 조회 (페이지네이션 x)
// export const getReviewsAllByStoreId = (id) => {
//   return axios.get(`${path}/store-review/all/${id}`).catch((e) => e.response);
// };


// 사용x
export const patchOwnerComment = (reviewId, ownerComment) => {
  return axios.patch( "/review/owner",
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

// 오더 아이디에 따른 리뷰 조회
export const getReviewOne = (orderId) => {
  return axios.get(`${path}/${orderId}`).catch((e) => e.response);
};


// 사장 코멘트 달린 리뷰 리스트 조회
export const getOwnerCommentList = (storeId)=>{
  return axios.get(`${path}/owner/comment/${storeId}`).catch((e)=> e.response);
}