import axios from "./httpRequester";

export const getStore = (id) => {
  return axios.get(`/store/${id}`).catch((e) => e.response);
};

export const getOrder = () => {
  return axios.get(`/order`).catch((e) => e.response);
};

export const activeStore = (id) => {
  return axios.patch(`/store/${id}`).catch((e) => e.response);
};

export const modify = (formData) => {
  const config = {
    header: {
      "Content-Type": "multipart/form-data",
    },
  };
  return axios.put("/store", formData, config).catch((e) => e.response);
};

export const getOwnerStore = () => {
  return axios.get(`/store/owner`).catch((e) => e.response);
};

export const getStoreList = (params) => {
  return axios.get("/store", { params }).catch((e) => e.response);
};

export default axios;
