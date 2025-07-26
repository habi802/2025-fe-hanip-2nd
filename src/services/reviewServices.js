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

export const saveReview = (formData) => {
  const config = {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  };
  return axios.post( path, formData, config).catch((e) => e.response);
};
