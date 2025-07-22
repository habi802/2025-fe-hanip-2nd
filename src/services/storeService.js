import axios from 'axios';
axios.defaults.baseURL = 'http://localhost:8080/api';

export const getStore = (id) => {
  return axios.get(`/store/${id}`).catch((e) => e.response);
};

export const getOrder = () => {
  return axios.get(`/order`).catch((e) => e.response);
};

export const modify = (formData) => {
  const config = {
    header: {
      'Content-Type': 'multipart/form-data',
    },
  };
  return axios.put('/store', formData, config).catch((e) => e.response);
};

export const getStoreList = () => {
  return axios.get('/store').catch((e) => e.response);
};

export default axios;
