import axios from './httpRequester';

export const getStore = () => {
  return axios.get(`/store/owner`).catch((e) => e.response);
};

export const getOrder = () => {
  return axios.get(`/order`).catch((e) => e.response);
};

export const activeStore2 = (id) => {
  return axios.patch(`/store/${id}`).catch((e) => e.response);
};

export const activeStore = (id) => {
  return axios.get(`/store/${id}`).catch((e) => e.response);
};

export const modify = (formData) => {
  const config = {
    header: {
      "Content-Type": "multipart/form-data",
    },
  };
  return axios.put("/store", formData, config).catch((e) => e.response);
};

export default axios;
