import axios from 'axios';
axios.defaults.baseURL = 'http://localhost:8080/api';

export const getOneMenu = (storeId) => {
  return axios.get(`/menu/${storeId}`).catch((e) => e.response);
};

export const getMenus = (menuId) => {
  return axios.get('/menu', { params: menuId }).catch((e) => e.response);
};

export default axios;
